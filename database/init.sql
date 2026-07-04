-- ============================================================
-- Database Initialization Script
-- Hệ thống Đặt vé xem phim trực tuyến v3.1 - MVP
-- PostgreSQL 15+
-- ============================================================

-- Drop existing tables if any (for dev reset)
DROP TABLE IF EXISTS booking_combos CASCADE;
DROP TABLE IF EXISTS booking_seats CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS seat_types CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS movie_genres CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS combos CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types if exist
DROP TYPE IF EXISTS booking_status;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS discount_type;
DROP TYPE IF EXISTS age_rating;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS entity_status;

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE age_rating AS ENUM ('P', 'T13', 'T16', 'T18');
CREATE TYPE entity_status AS ENUM ('ACTIVE', 'INACTIVE', 'COMING_SOON', 'CANCELLED', 'MAINTENANCE', 'DISABLED', 'EXPIRED');

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    gender          VARCHAR(10),
    date_of_birth   DATE,
    avatar          TEXT,
    role            user_role NOT NULL DEFAULT 'CUSTOMER',
    status          entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- 2. MOVIES
-- ============================================================
CREATE TABLE movies (
    movie_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    duration            INT NOT NULL CHECK (duration > 0),
    language            VARCHAR(50) NOT NULL DEFAULT 'Tiếng Việt',
    language_display    VARCHAR(255) DEFAULT 'Đang cập nhật',
    age_rating          age_rating NOT NULL DEFAULT 'P',
    trailer_url         TEXT,
    poster_url          TEXT,
    director            VARCHAR(255) NOT NULL DEFAULT 'Đang cập nhật',
    actors              TEXT DEFAULT 'Đang cập nhật',
    showing_start_date  DATE NOT NULL,
    showing_end_date    DATE NOT NULL,
    status              entity_status NOT NULL DEFAULT 'COMING_SOON',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_date_range CHECK (showing_end_date >= showing_start_date)
);

CREATE INDEX idx_movies_title ON movies USING gin(to_tsvector('simple', title));
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_showing_dates ON movies(showing_start_date, showing_end_date);

-- ============================================================
-- 3. GENRES
-- ============================================================
CREATE TABLE genres (
    genre_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_genres_slug ON genres(slug);

-- ============================================================
-- 4. MOVIE_GENRES (Junction)
-- ============================================================
CREATE TABLE movie_genres (
    movie_id    UUID NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    genre_id    UUID NOT NULL REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE INDEX idx_movie_genres_movie ON movie_genres(movie_id);
CREATE INDEX idx_movie_genres_genre ON movie_genres(genre_id);

-- ============================================================
-- 5. ROOMS
-- ============================================================
CREATE TABLE rooms (
    room_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name       VARCHAR(100) NOT NULL,
    total_rows      INT NOT NULL CHECK (total_rows > 0),
    total_columns   INT NOT NULL CHECK (total_columns > 0),
    aisle_after_columns VARCHAR(50) DEFAULT '4',
    status          entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 6. SEAT_TYPES
-- ============================================================
CREATE TABLE seat_types (
    seat_type_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_name       VARCHAR(50) NOT NULL,
    price_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00 CHECK (price_multiplier >= 1.00),
    color_hex       VARCHAR(7) NOT NULL DEFAULT '#4CAF50',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 7. SEATS
-- ============================================================
CREATE TABLE seats (
    seat_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    seat_type_id    UUID NOT NULL REFERENCES seat_types(seat_type_id),
    row_label       VARCHAR(5) NOT NULL,
    seat_number     INT NOT NULL CHECK (seat_number > 0),
    status          entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (room_id, row_label, seat_number)
);

CREATE INDEX idx_seats_room ON seats(room_id);
CREATE INDEX idx_seats_type ON seats(seat_type_id);

-- ============================================================
-- 8. SHOWTIMES
-- ============================================================
CREATE TABLE showtimes (
    showtime_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id        UUID NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    room_id         UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    start_time      TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    base_price      DECIMAL(12,2) NOT NULL CHECK (base_price > 0),
    status          entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_time CHECK (end_time > start_time),
    CONSTRAINT uq_room_time UNIQUE (room_id, start_time)
);

CREATE INDEX idx_showtimes_movie ON showtimes(movie_id);
CREATE INDEX idx_showtimes_room ON showtimes(room_id);
CREATE INDEX idx_showtimes_start ON showtimes(start_time);
CREATE INDEX idx_showtimes_status ON showtimes(status);

-- ============================================================
-- 9. COUPONS
-- ============================================================
CREATE TABLE coupons (
    coupon_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    discount_type   discount_type NOT NULL,
    discount_value  DECIMAL(12,2) NOT NULL CHECK (discount_value > 0),
    quantity        INT NOT NULL CHECK (quantity >= 0),
    min_order_value DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
    expired_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    status          entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- ============================================================
-- 10. BOOKINGS
-- ============================================================
CREATE TABLE bookings (
    booking_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(user_id),
    coupon_id       UUID REFERENCES coupons(coupon_id),
    total_amount    DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    booking_status  booking_status NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_coupon ON bookings(coupon_id);

-- ============================================================
-- 11. BOOKING_SEATS
-- ============================================================
CREATE TABLE booking_seats (
    booking_seat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_id         UUID NOT NULL REFERENCES seats(seat_id),
    showtime_id     UUID NOT NULL REFERENCES showtimes(showtime_id),
    seat_price      DECIMAL(12,2) NOT NULL CHECK (seat_price > 0),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_booking_seats_booking ON booking_seats(booking_id);
CREATE INDEX idx_booking_seats_seat ON booking_seats(seat_id);
CREATE INDEX idx_booking_seats_showtime ON booking_seats(showtime_id);

-- ============================================================
-- 12. COMBOS
-- ============================================================
CREATE TABLE combos (
    combo_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_name  VARCHAR(255) NOT NULL,
    description TEXT,
    price       DECIMAL(12,2) NOT NULL CHECK (price > 0),
    image_url   TEXT,
    status      entity_status NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_combos_status ON combos(status);

-- ============================================================
-- 13. BOOKING_COMBOS
-- ============================================================
CREATE TABLE booking_combos (
    booking_combo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id       UUID NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    combo_id         UUID NOT NULL REFERENCES combos(combo_id),
    quantity         INT NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(12,2) NOT NULL CHECK (price_at_purchase > 0),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_booking_combos_booking ON booking_combos(booking_id);
CREATE INDEX idx_booking_combos_combo ON booking_combos(combo_id);

-- ============================================================
-- 14. PAYMENTS
-- ============================================================
CREATE TABLE payments (
    payment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id       UUID NOT NULL UNIQUE REFERENCES bookings(booking_id),
    payment_method   VARCHAR(50) NOT NULL DEFAULT 'VNPAY',
    transaction_code VARCHAR(255),
    payment_status   payment_status NOT NULL DEFAULT 'PENDING',
    paid_at          TIMESTAMP WITH TIME ZONE,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin account (password: admin123 - hashed with BCrypt)
INSERT INTO users (user_id, full_name, email, password_hash, role, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'System Admin', 'admin@cinema.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN', 'ACTIVE');

-- Seat types
INSERT INTO seat_types (seat_type_id, type_name, price_multiplier, color_hex) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Standard', 1.00, '#4CAF50'),
    ('a0000001-0000-0000-0000-000000000002', 'VIP', 1.50, '#FF9800'),
    ('a0000001-0000-0000-0000-000000000003', 'Couple', 2.00, '#E91E63');

-- Genres
INSERT INTO genres (genre_id, name, slug) VALUES
    ('b0000001-0000-0000-0000-000000000001', 'Hành động', 'hanh-dong'),
    ('b0000001-0000-0000-0000-000000000002', 'Hài hước', 'hai-huoc'),
    ('b0000001-0000-0000-0000-000000000003', 'Tình cảm', 'tinh-cam'),
    ('b0000001-0000-0000-0000-000000000004', 'Kinh dị', 'kinh-di'),
    ('b0000001-0000-0000-0000-000000000005', 'Khoa học viễn tưởng', 'khoa-hoc-vien-tuong'),
    ('b0000001-0000-0000-0000-000000000006', 'Hoạt hình', 'hoat-hinh');

-- Sample combos
INSERT INTO combos (combo_id, combo_name, description, price, image_url) VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Combo Solo', '1 bắp rang bơ + 1 nước ngọt', 55000, '/images/combos/solo.png'),
    ('c0000001-0000-0000-0000-000000000002', 'Combo Đôi', '2 bắp rang bơ + 2 nước ngọt', 99000, '/images/combos/doi.png'),
    ('c0000001-0000-0000-0000-000000000003', 'Combo Gia đình', '3 bắp rang bơ + 3 nước ngọt + 1 bỏng ngô', 149000, '/images/combos/gia-dinh.png');

-- ============================================================
-- FUNCTION: Auto update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
            t, t
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
