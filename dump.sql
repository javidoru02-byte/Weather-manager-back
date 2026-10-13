--
-- PostgreSQL database dump
--

\restrict hER8tutP4JczluZoh1TvaQfXRquMVQNV0b6XaRZTS7P64fOtDoZjesdFaVUYJIw

-- Dumped from database version 18.6 (Ubuntu 18.6-1.pgdg24.04+2)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-1.pgdg24.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favourite_weather; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favourite_weather (
    user_id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    lat numeric(9,6) NOT NULL,
    lon numeric(9,6) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.favourite_weather OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: favourite_weather; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favourite_weather (user_id, city_id, name, lat, lon, created_at) FROM stdin;
1	702550	Ternopil	49.553520	25.594770	2026-10-07 14:38:09.038783
1	703448	Kyiv	50.450100	30.523400	2026-10-07 14:38:09.038783
2	702550	Ternopil	49.553520	25.594770	2026-10-07 14:38:09.038783
2	702634	Lviv	49.839680	24.029700	2026-10-07 14:38:09.038783
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, created_at) FROM stdin;
1	ivan.petrenko@example.com	placeholder_hash_1	Ivan Petrenko	2026-10-07 14:38:09.038783
2	olha.kovalenko@example.com	placeholder_hash_2	Olha Kovalenko	2026-10-07 14:38:09.038783
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: favourite_weather favourite_weather_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite_weather
    ADD CONSTRAINT favourite_weather_pkey PRIMARY KEY (user_id, city_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_favourite_weather_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_favourite_weather_user_id ON public.favourite_weather USING btree (user_id);


--
-- Name: favourite_weather favourite_weather_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite_weather
    ADD CONSTRAINT favourite_weather_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict hER8tutP4JczluZoh1TvaQfXRquMVQNV0b6XaRZTS7P64fOtDoZjesdFaVUYJIw

