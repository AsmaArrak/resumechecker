drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.touch_updated_at() cascade;
drop function if exists public.get_usage_status() cascade;
drop function if exists public.consume_usage_attempt(text) cascade;
drop function if exists public.is_admin() cascade;

drop table if exists public.user_roles cascade;
drop table if exists public.usage_windows cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text default '',
  title text default '',
  location text default '',
  company text default '',
  avatar_url text default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'free',
  billing_email text default '',
  provider text default 'manual',
  current_period_end timestamptz,
  auto_renew boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.usage_windows (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  window_start timestamptz not null default timezone('utc', now()),
  score_checks_used integer not null default 0,
  resume_generations_used integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_windows enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_select_admin"
on public.profiles for select
using (public.is_admin());

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

create policy "profiles_update_admin"
on public.profiles for update
using (public.is_admin());

create policy "subscriptions_select_own"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy "subscriptions_select_admin"
on public.subscriptions for select
using (public.is_admin());

create policy "subscriptions_insert_own"
on public.subscriptions for insert
with check (auth.uid() = user_id);

create policy "subscriptions_insert_admin"
on public.subscriptions for insert
with check (public.is_admin());

create policy "subscriptions_update_own"
on public.subscriptions for update
using (auth.uid() = user_id);

create policy "subscriptions_update_admin"
on public.subscriptions for update
using (public.is_admin());

create policy "usage_windows_select_own"
on public.usage_windows for select
using (auth.uid() = user_id);

create policy "usage_windows_select_admin"
on public.usage_windows for select
using (public.is_admin());

create policy "usage_windows_insert_own"
on public.usage_windows for insert
with check (auth.uid() = user_id);

create policy "usage_windows_insert_admin"
on public.usage_windows for insert
with check (public.is_admin());

create policy "usage_windows_update_own"
on public.usage_windows for update
using (auth.uid() = user_id);

create policy "usage_windows_update_admin"
on public.usage_windows for update
using (public.is_admin());

create policy "user_roles_select_own"
on public.user_roles for select
using (auth.uid() = user_id);

create policy "user_roles_select_admin"
on public.user_roles for select
using (public.is_admin());

create policy "user_roles_insert_admin"
on public.user_roles for insert
with check (public.is_admin());

create policy "user_roles_update_admin"
on public.user_roles for update
using (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create trigger subscriptions_touch_updated_at
before update on public.subscriptions
for each row execute procedure public.touch_updated_at();

create trigger usage_windows_touch_updated_at
before update on public.usage_windows
for each row execute procedure public.touch_updated_at();

create trigger user_roles_touch_updated_at
before update on public.user_roles
for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status, billing_email)
  values (new.id, 'free', 'free', coalesce(new.email, ''))
  on conflict (user_id) do nothing;

  insert into public.usage_windows (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', '')
from auth.users u
on conflict (id) do nothing;

insert into public.subscriptions (user_id, plan, status, billing_email)
select
  u.id,
  'free',
  'free',
  coalesce(u.email, '')
from auth.users u
on conflict (user_id) do nothing;

insert into public.usage_windows (user_id)
select u.id
from auth.users u
on conflict (user_id) do nothing;

insert into public.user_roles (user_id, role)
select u.id, 'user'
from auth.users u
on conflict (user_id) do nothing;

create or replace function public.get_usage_status()
returns table (
  is_pro boolean,
  analyses_remaining integer,
  generations_remaining integer,
  reset_at timestamptz,
  score_checks_used integer,
  resume_generations_used integer,
  window_start timestamptz
)
language sql
security definer
set search_path = public
as $$
with ensured as (
  insert into public.usage_windows (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing
),
reset_rows as (
  update public.usage_windows
  set
    window_start = timezone('utc', now()),
    score_checks_used = 0,
    resume_generations_used = 0
  where user_id = auth.uid()
    and window_start <= timezone('utc', now()) - interval '24 hours'
  returning *
),
usage_row as (
  select * from reset_rows
  union all
  select uw.*
  from public.usage_windows uw
  where uw.user_id = auth.uid()
    and not exists (select 1 from reset_rows)
),
sub as (
  select
    coalesce(
      (
        select s.plan
        from public.subscriptions s
        where s.user_id = auth.uid()
          and s.status = 'active'
        limit 1
      ),
      'free'
    ) as active_plan
),
plan_limits as (
  select
    active_plan,
    case
      when active_plan = 'plus' then 12
      when active_plan = 'pro' then 20
      else 2
    end as daily_limit,
    active_plan in ('plus', 'pro') as is_pro
  from sub
)
select
  plan_limits.is_pro,
  greatest(0, plan_limits.daily_limit - usage_row.score_checks_used) as analyses_remaining,
  greatest(0, plan_limits.daily_limit - usage_row.resume_generations_used) as generations_remaining,
  usage_row.window_start + interval '24 hours' as reset_at,
  usage_row.score_checks_used,
  usage_row.resume_generations_used,
  usage_row.window_start
from usage_row, plan_limits;
$$;

create or replace function public.consume_usage_attempt(action_name text)
returns table (
  allowed boolean,
  message text,
  is_pro boolean,
  analyses_remaining integer,
  generations_remaining integer,
  reset_at timestamptz,
  score_checks_used integer,
  resume_generations_used integer
)
language sql
security definer
set search_path = public
as $$
with ensured as (
  insert into public.usage_windows (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing
),
reset_rows as (
  update public.usage_windows
  set
    window_start = timezone('utc', now()),
    score_checks_used = 0,
    resume_generations_used = 0
  where user_id = auth.uid()
    and window_start <= timezone('utc', now()) - interval '24 hours'
  returning *
),
base_usage as (
  select * from reset_rows
  union all
  select uw.*
  from public.usage_windows uw
  where uw.user_id = auth.uid()
    and not exists (select 1 from reset_rows)
),
sub as (
  select
    coalesce(
      (
        select s.plan
        from public.subscriptions s
        where s.user_id = auth.uid()
          and s.status = 'active'
        limit 1
      ),
      'free'
    ) as active_plan
),
plan_limits as (
  select
    active_plan,
    case
      when active_plan = 'plus' then 12
      when active_plan = 'pro' then 20
      else 2
    end as daily_limit,
    active_plan in ('plus', 'pro') as is_pro
  from sub
),
updated as (
  update public.usage_windows uw
  set
    score_checks_used = uw.score_checks_used + case when action_name = 'analysis' then 1 else 0 end,
    resume_generations_used = uw.resume_generations_used + case when action_name = 'generation' then 1 else 0 end
  from base_usage bu, plan_limits
  where uw.user_id = auth.uid()
    and not (
      (action_name = 'analysis' and bu.score_checks_used >= plan_limits.daily_limit) or
      (action_name = 'generation' and bu.resume_generations_used >= plan_limits.daily_limit)
    )
  returning uw.*
),
final_usage as (
  select * from updated
  union all
  select * from base_usage
  where not exists (select 1 from updated)
),
sub_final as (
  select active_plan, daily_limit, is_pro from plan_limits
)
select
  case
    when action_name = 'analysis' and final_usage.score_checks_used >= sub_final.daily_limit and not exists (select 1 from updated) then false
    when action_name = 'generation' and final_usage.resume_generations_used >= sub_final.daily_limit and not exists (select 1 from updated) then false
    else true
  end as allowed,
  case
    when action_name = 'analysis' and final_usage.score_checks_used >= sub_final.daily_limit and not exists (select 1 from updated)
      then initcap(sub_final.active_plan) || ' accounts can run ' || sub_final.daily_limit || ' analyses every 24 hours. Please wait for the reset or upgrade.'
    when action_name = 'generation' and final_usage.resume_generations_used >= sub_final.daily_limit and not exists (select 1 from updated)
      then initcap(sub_final.active_plan) || ' accounts can generate ' || sub_final.daily_limit || ' resumes every 24 hours. Please wait for the reset or upgrade.'
    when action_name = 'analysis' then 'Analysis attempt counted.'
    else 'Resume generation attempt counted.'
  end as message,
  sub_final.is_pro,
  greatest(0, sub_final.daily_limit - final_usage.score_checks_used) as analyses_remaining,
  greatest(0, sub_final.daily_limit - final_usage.resume_generations_used) as generations_remaining,
  final_usage.window_start + interval '24 hours' as reset_at,
  final_usage.score_checks_used,
  final_usage.resume_generations_used
from final_usage, sub_final;
$$;

-- After running this file, promote your admin account with:
-- insert into public.user_roles (user_id, role)
-- select id, 'admin'
-- from auth.users
-- where email = 'your-real-email@example.com'
-- on conflict (user_id) do update
-- set role = excluded.role, updated_at = timezone('utc', now());
