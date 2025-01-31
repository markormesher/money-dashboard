--
-- Name: account; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.account (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    type character varying DEFAULT 'current'::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    profile_id uuid NOT NULL,
    note character varying,
    tags character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    currency_code character varying NOT NULL,
    stock_ticker character varying,
    include_in_envelopes boolean DEFAULT true
);


ALTER TABLE public.account OWNER TO money_dashboard;

--
-- Name: budget; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.budget (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    type character varying DEFAULT 'budget'::character varying NOT NULL,
    amount double precision NOT NULL,
    start_date bigint NOT NULL,
    end_date bigint NOT NULL,
    category_id uuid,
    profile_id uuid
);


ALTER TABLE public.budget OWNER TO money_dashboard;

--
-- Name: category; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    is_memo_category boolean DEFAULT false NOT NULL,
    is_income_category boolean DEFAULT false NOT NULL,
    is_expense_category boolean DEFAULT false NOT NULL,
    is_asset_growth_category boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    profile_id uuid
);


ALTER TABLE public.category OWNER TO money_dashboard;

--
-- Name: envelope; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.envelope (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    profile_id uuid NOT NULL
);


ALTER TABLE public.envelope OWNER TO money_dashboard;

--
-- Name: envelope_allocation; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.envelope_allocation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    start_date bigint NOT NULL,
    category_id uuid NOT NULL,
    envelope_id uuid NOT NULL,
    profile_id uuid NOT NULL
);


ALTER TABLE public.envelope_allocation OWNER TO money_dashboard;

--
-- Name: envelope_transfer; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.envelope_transfer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    date bigint NOT NULL,
    amount double precision NOT NULL,
    note character varying,
    from_envelope_id uuid,
    to_envelope_id uuid,
    profile_id uuid NOT NULL
);


ALTER TABLE public.envelope_transfer OWNER TO money_dashboard;

--
-- Name: exchange_rate; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.exchange_rate (
    currency_code character varying NOT NULL,
    date bigint NOT NULL,
    rate_per_gbp double precision NOT NULL,
    update_time bigint DEFAULT '-1'::integer NOT NULL
);


ALTER TABLE public.exchange_rate OWNER TO money_dashboard;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.migrations (
    migration_in_progress boolean DEFAULT false NOT NULL,
    last_migration integer DEFAULT '-1'::integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO money_dashboard;

--
-- Name: profile; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.profile (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.profile OWNER TO money_dashboard;

--
-- Name: stock_price; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.stock_price (
    ticker character varying NOT NULL,
    date bigint NOT NULL,
    rate_per_base_currency double precision
);


ALTER TABLE public.stock_price OWNER TO money_dashboard;

--
-- Name: transaction; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.transaction (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    transaction_date bigint NOT NULL,
    effective_date bigint NOT NULL,
    amount double precision NOT NULL,
    payee character varying NOT NULL,
    note character varying,
    deleted boolean DEFAULT false NOT NULL,
    account_id uuid,
    category_id uuid,
    profile_id uuid,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transaction OWNER TO money_dashboard;

--
-- Name: user; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    display_name character varying NOT NULL,
    image character varying NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    active_profile_id uuid,
    external_username character varying
);


ALTER TABLE public."user" OWNER TO money_dashboard;

--
-- Name: user_profiles_profile; Type: TABLE; Schema: public; Owner: money_dashboard
--

CREATE TABLE IF NOT EXISTS public.user_profiles_profile (
    user_id uuid NOT NULL,
    profile_id uuid NOT NULL
);


ALTER TABLE public.user_profiles_profile OWNER TO money_dashboard;
