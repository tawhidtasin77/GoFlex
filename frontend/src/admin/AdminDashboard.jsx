import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { api } from "../api/api";
import logo from "../assets/logo.png";

const AdminDashboard = () => {
    const {
        user,
        loading: authLoading,
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        const fetchStats = async () => {
            try {
                setLoading(true);

                const response =
                    await api.get("/analytics");

                setStats(response.data.data);

            } catch (error) {
                console.error(
                    "Failed to fetch dashboard statistics:",
                    {
                        status:
                            error.response?.status,
                        data:
                            error.response?.data,
                        url:
                            error.config?.url,
                        message:
                            error.message,
                    }
                );

                setStats(null);

            } finally {
                setLoading(false);
            }
        };

        fetchStats();

    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <p className="text-orange-500">
                    Loading...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (user.role !== "admin") {
        return null;
    }

    const dashboardCards = [
        {
            title: "Total Orders",
            value:
                stats?.totalOrders ?? 0,
            icon: "🛒",
            description: "Orders placed",
        },
        {
            title: "Total Products",
            value:
                stats?.totalProducts ?? 0,
            icon: "📦",
            description:
                "Products in store",
        },
        {
            title: "Total Users",
            value:
                stats?.totalUsers ?? 0,
            icon: "👥",
            description:
                "Registered customers",
        },
        {
            title: "Total Revenue",
            value: `৳${Number(
                stats?.totalRevenue ?? 0
            ).toFixed(2)}`,
            icon: "💰",
            description:
                "Total earnings",
        },
    ];

    const adminControls = [
        {
            title: "Add Product",
            description:
                "Add a new product to GoFlex",
            icon: "＋",
            path: "/admin/add-product",
            primary: true,
        },
        {
            title: "Manage Products",
            description:
                "View, edit or delete products",
            icon: "📦",
            path: "/admin/products",
        },
        {
            title: "Manage Orders",
            description:
                "View and manage customer orders",
            icon: "🚚",
            path: "/admin/orders",
        },
        {
            title: "Users Directory",
            description:
                "View registered GoFlex users",
            icon: "👥",
            path: "/admin/users",
        },
        {
            title: "Return Requests",
            description:
                "Review and manage customer return requests",
            icon: "↩️",
            path: "/admin/returns",
            primary: false,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-3">

                            <img
                                src={logo}
                                alt="GoFlex Logo"
                                className="h-10 w-10 rounded-xl object-contain"
                            />

                            <div>

                                <p className="text-sm font-medium text-orange-500">
                                    GoFlex Admin
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Admin Dashboard
                                </h1>

                            </div>

                        </div>

                        <p className="mt-3 text-zinc-400">
                            Welcome back,{" "}
                            <span className="font-semibold text-white">
                                {user.name}
                            </span>
                            . Here's what's happening with your store.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/shop")
                        }
                        className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-orange-500 hover:text-orange-500"
                    >
                        View Store
                    </button>

                </div>

                {/* Store Overview */}

                <section>

                    <div className="mb-5">

                        <h2 className="text-xl font-bold text-white">
                            Store Overview
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            A quick overview of your GoFlex store.
                        </p>

                    </div>

                    {loading ? (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
                                    />
                                )
                            )}

                        </div>

                    ) : !stats ? (

                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
                            Failed to load dashboard
                            statistics.
                            <p className="mt-2 text-sm text-red-400/70">
                                Check the browser console
                                for the API error.
                            </p>
                        </div>

                    ) : (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {dashboardCards.map(
                                (card) => (

                                    <div
                                        key={card.title}
                                        className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-orange-500/40"
                                    >

                                        <div className="flex items-start justify-between">

                                            <div>

                                                <p className="text-sm font-medium text-zinc-400">
                                                    {card.title}
                                                </p>

                                                <p className="mt-3 text-3xl font-bold text-white">
                                                    {card.value}
                                                </p>

                                            </div>

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl ring-1 ring-orange-500/20">
                                                {card.icon}
                                            </div>

                                        </div>

                                        <p className="mt-5 text-xs text-zinc-500">
                                            {card.description}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* Administrative Controls */}

                <section className="mt-12">

                    <div className="mb-5">

                        <h2 className="text-xl font-bold text-white">
                            Administrative Controls
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Manage your GoFlex store from one place.
                        </p>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {adminControls.map(
                            (control) => (

                                <button
                                    key={control.title}
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            control.path
                                        )
                                    }
                                    className={`group cursor-pointer rounded-2xl border p-6 text-left transition duration-300 hover:-translate-y-1 ${
                                        control.primary
                                            ? "border-orange-500/30 bg-orange-500/10 hover:border-orange-500 hover:bg-orange-500/15"
                                            : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                                    }`}
                                >

                                    <div
                                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                                            control.primary
                                                ? "bg-orange-500 text-white"
                                                : "bg-zinc-800 text-zinc-200"
                                        }`}
                                    >
                                        {control.icon}
                                    </div>

                                    <h3 className="text-lg font-bold text-white">
                                        {control.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        {control.description}
                                    </p>

                                    <div className="mt-5 text-sm font-semibold text-orange-500 transition group-hover:text-orange-400">
                                        Open →
                                    </div>

                                </button>

                            )
                        )}

                    </div>

                </section>

                {/* Store Management */}

                <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-lg font-bold text-white">
                                GoFlex Store Management
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Use the controls above to manage products,
                                orders, customers, and return requests.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/shop")
                            }
                            className="cursor-pointer rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Visit GoFlex
                        </button>

                    </div>

                </section>

            </div>
        </div>
    );
};

export default AdminDashboard;