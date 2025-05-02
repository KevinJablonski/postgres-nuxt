-- 1) Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) ENUM types
CREATE TYPE appointment_status AS ENUM ('Scheduled','Completed','Cancelled');
CREATE TYPE payment_method_type AS ENUM ('Cash','Card','Online');

-- 3) Clients table
CREATE TABLE clients (
  id    SERIAL      PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20)
);

-- 4) Stylists table
CREATE TABLE stylists (
  id             SERIAL      PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  photo_url      TEXT
);

-- 5) Services table
CREATE TABLE services (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL
);

-- 6) Availability table (no overlapping slots)
CREATE TABLE availability (
  id             SERIAL      PRIMARY KEY,
  stylist_id     INT         NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  available_date DATE        NOT NULL,
  available_time TIME        NOT NULL,
  UNIQUE(stylist_id, available_date, available_time)
);

-- 7) Appointments table
CREATE TABLE appointments (
  id                    SERIAL      PRIMARY KEY,
  client_id             INT         NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id            INT         NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  stylist_id            INT         NOT NULL REFERENCES stylists(id) ON DELETE RESTRICT,
  appointment_datetime  TIMESTAMP   NOT NULL,
  status                appointment_status NOT NULL DEFAULT 'Scheduled',
  booking_code          UUID        NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at            TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- 8) Reviews table
CREATE TABLE reviews (
  id             SERIAL      PRIMARY KEY,
  appointment_id INT         NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  rating         INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  review_date    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- 9) Payments table
CREATE TABLE payments (
  id             SERIAL      PRIMARY KEY,
  appointment_id INT         NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  amount         NUMERIC(10,2) NOT NULL,
  method         payment_method_type NOT NULL,
  paid_at        TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id)
);

-- 10) Appointment Cancellations (reasons stored inline)
CREATE TABLE appointment_cancellations (
  appointment_id INT       PRIMARY KEY REFERENCES appointments(id) ON DELETE CASCADE,
  reason_text    TEXT      NOT NULL,
  cancelled_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 11) Trigger function to auto-cancel an appointment when a cancellation is recorded
CREATE OR REPLACE FUNCTION fn_cancel_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE appointments
     SET status = 'Cancelled'
   WHERE id = NEW.appointment_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cancel_appointment ON appointment_cancellations;
CREATE TRIGGER trg_cancel_appointment
  AFTER INSERT ON appointment_cancellations
  FOR EACH ROW
  EXECUTE FUNCTION fn_cancel_appointment();

-- 12) VIEW: stylist_schedule (non-trivial join + filter)
CREATE OR REPLACE VIEW stylist_schedule AS
SELECT
  s.id                   AS stylist_id,
  s.name                 AS stylist_name,
  a.appointment_datetime,
  c.name                 AS client_name,
  srv.name               AS service_name,
  a.status
FROM appointments a
JOIN stylists s   ON a.stylist_id  = s.id
JOIN clients c    ON a.client_id   = c.id
JOIN services srv ON a.service_id  = srv.id
WHERE a.status = 'Scheduled'
  AND a.appointment_datetime >= NOW();

-- 13) PROCEDURE: create_appointment
CREATE OR REPLACE PROCEDURE create_appointment(
  p_client_id  INT,
  p_service_id INT,
  p_stylist_id INT,
  p_datetime   TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO appointments (
    client_id, service_id, stylist_id, appointment_datetime
  ) VALUES (
    p_client_id, p_service_id, p_stylist_id, p_datetime
  );
END;
$$;

-- 14) FUNCTION: get_stylist_avg_rating
CREATE OR REPLACE FUNCTION get_stylist_avg_rating(p_stylist_id INT)
RETURNS NUMERIC(3,2)
LANGUAGE plpgsql
AS $$
DECLARE
  avg_rating NUMERIC(3,2);
BEGIN
  SELECT COALESCE(AVG(r.rating),0)::NUMERIC(3,2)
    INTO avg_rating
  FROM reviews r
  JOIN appointments a ON r.appointment_id = a.id
  WHERE a.stylist_id = p_stylist_id;
  RETURN avg_rating;
END;
$$;

-- 15) REPORT VIEW: monthly_revenue_by_service
CREATE OR REPLACE VIEW monthly_revenue_by_service AS
SELECT
  srv.name                        AS service_name,
  DATE_TRUNC('month', p.paid_at)  AS month,
  SUM(p.amount)                   AS total_revenue
FROM payments p
JOIN appointments a ON p.appointment_id = a.id
JOIN services srv   ON a.service_id      = srv.id
GROUP BY 1,2
ORDER BY 2 DESC;
