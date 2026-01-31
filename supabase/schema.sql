-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('admin', 'organizer', 'participant');
create type event_status as enum ('draft', 'pending', 'approved', 'rejected');
create type resource_type as enum ('room', 'equipment');
create type booking_status as enum ('confirmed', 'cancelled');
create type member_role as enum ('member', 'lead');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role user_role default 'participant',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clubs
create table public.clubs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Club Members
create table public.club_members (
  club_id uuid references public.clubs on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role member_role default 'member',
  primary key (club_id, user_id)
);

-- Resources
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type resource_type not null,
  capacity int,
  is_active boolean default true
);

-- Events
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text,
  status event_status default 'draft',
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  organizer_id uuid references public.profiles on delete set null,
  is_collaborative boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event Clubs (Collaborative)
create table public.event_clubs (
  event_id uuid references public.events on delete cascade not null,
  club_id uuid references public.clubs on delete cascade not null,
  primary key (event_id, club_id)
);

-- Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events on delete cascade not null,
  resource_id uuid references public.resources on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status booking_status default 'confirmed'
);

-- Event Registrations (Participants)
create table public.event_registrations (
  event_id uuid references public.events on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (event_id, user_id)
);

-- =====================
-- Row Level Security
-- =====================

alter table profiles enable row level security;
alter table clubs enable row level security;
alter table resources enable row level security;
alter table events enable row level security;
alter table bookings enable row level security;
alter table event_registrations enable row level security;
alter table club_members enable row level security;
alter table event_clubs enable row level security;

-- =====================
-- Profiles Policies
-- =====================
create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);

create policy "Users can insert own profile." 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on profiles for update using (auth.uid() = id);

-- =====================
-- Clubs Policies
-- =====================
create policy "Clubs are viewable by everyone." 
  on clubs for select using (true);

-- =====================
-- Resources Policies
-- =====================
create policy "Resources are viewable by everyone." 
  on resources for select using (true);

create policy "Admins can manage resources." 
  on resources for all using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- =====================
-- Events Policies
-- =====================
create policy "Events are viewable by everyone." 
  on events for select using (true);

create policy "Organizers and admins can create events." 
  on events for insert with check (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('organizer', 'admin')
    )
  );

create policy "Organizers can update own events." 
  on events for update using (
    organizer_id = auth.uid() or 
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete events." 
  on events for delete using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role = 'admin'
    )
  );

-- =====================
-- Bookings Policies
-- =====================
create policy "Bookings are viewable by everyone." 
  on bookings for select using (true);

create policy "Organizers and admins can create bookings." 
  on bookings for insert with check (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('organizer', 'admin')
    )
  );

-- =====================
-- Event Registrations Policies
-- =====================
create policy "Registrations are viewable by everyone." 
  on event_registrations for select using (true);

create policy "Users can register for events." 
  on event_registrations for insert with check (auth.uid() = user_id);

create policy "Users can cancel own registration." 
  on event_registrations for delete using (auth.uid() = user_id);

-- =====================
-- Club Members Policies
-- =====================
create policy "Club members are viewable by everyone." 
  on club_members for select using (true);

-- =====================
-- Event Clubs Policies
-- =====================
create policy "Event clubs are viewable by everyone." 
  on event_clubs for select using (true);

-- =====================
-- Trigger for Profile creation on Signup
-- =====================
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'participant')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
