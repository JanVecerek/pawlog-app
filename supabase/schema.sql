-- Pets table
create table if not exists pets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  birth_date date,
  weight_kg numeric(5,2),
  chip_number text,
  photo_url text,
  created_at timestamptz default now() not null
);

-- Vet visits table
create table if not exists vet_visits (
  id uuid default gen_random_uuid() primary key,
  pet_id uuid references pets(id) on delete cascade not null,
  date date not null,
  vet_name text,
  diagnosis text,
  treatment text,
  cost numeric(10,2),
  notes text,
  created_at timestamptz default now() not null
);

-- Vaccinations table
create table if not exists vaccinations (
  id uuid default gen_random_uuid() primary key,
  pet_id uuid references pets(id) on delete cascade not null,
  name text not null,
  date_given date not null,
  next_due date,
  notes text,
  created_at timestamptz default now() not null
);

-- Dewormings table
create table if not exists dewormings (
  id uuid default gen_random_uuid() primary key,
  pet_id uuid references pets(id) on delete cascade not null,
  product text not null,
  date_given date not null,
  next_due date,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table pets enable row level security;
alter table vet_visits enable row level security;
alter table vaccinations enable row level security;
alter table dewormings enable row level security;

-- RLS policies for pets
create policy "Users can view own pets" on pets
  for select using (auth.uid() = user_id);

create policy "Users can insert own pets" on pets
  for insert with check (auth.uid() = user_id);

create policy "Users can update own pets" on pets
  for update using (auth.uid() = user_id);

create policy "Users can delete own pets" on pets
  for delete using (auth.uid() = user_id);

-- RLS policies for vet_visits (via pets ownership)
create policy "Users can view own vet visits" on vet_visits
  for select using (
    exists (select 1 from pets where pets.id = vet_visits.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can insert vet visits for own pets" on vet_visits
  for insert with check (
    exists (select 1 from pets where pets.id = vet_visits.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can update own vet visits" on vet_visits
  for update using (
    exists (select 1 from pets where pets.id = vet_visits.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can delete own vet visits" on vet_visits
  for delete using (
    exists (select 1 from pets where pets.id = vet_visits.pet_id and pets.user_id = auth.uid())
  );

-- RLS policies for vaccinations
create policy "Users can view own vaccinations" on vaccinations
  for select using (
    exists (select 1 from pets where pets.id = vaccinations.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can insert vaccinations for own pets" on vaccinations
  for insert with check (
    exists (select 1 from pets where pets.id = vaccinations.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can update own vaccinations" on vaccinations
  for update using (
    exists (select 1 from pets where pets.id = vaccinations.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can delete own vaccinations" on vaccinations
  for delete using (
    exists (select 1 from pets where pets.id = vaccinations.pet_id and pets.user_id = auth.uid())
  );

-- RLS policies for dewormings
create policy "Users can view own dewormings" on dewormings
  for select using (
    exists (select 1 from pets where pets.id = dewormings.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can insert dewormings for own pets" on dewormings
  for insert with check (
    exists (select 1 from pets where pets.id = dewormings.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can update own dewormings" on dewormings
  for update using (
    exists (select 1 from pets where pets.id = dewormings.pet_id and pets.user_id = auth.uid())
  );

create policy "Users can delete own dewormings" on dewormings
  for delete using (
    exists (select 1 from pets where pets.id = dewormings.pet_id and pets.user_id = auth.uid())
  );
