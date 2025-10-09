
 'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import LandingHero from './components/LandingHero';
import OrderService from './orders/services/orderService';

import { Order } from './orders/models/Order.dto';

export default function Home() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const data = await OrderService.getCustomerOrders();
        setOrders(data.slice(0, 3));
      } catch (err: any) {
        // If user not authenticated or API error, show a soft message
        setOrdersError(err?.message || 'Could not load recent orders');
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full">
  <LandingHero />
  <section className="bg-gradient-to-b from-white to-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welcome to Malaura</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Discover handcrafted goods, curated collections and support independent creators across Egypt.</p>

            <div className="flex justify-center gap-4">
              <Link href="/items" className="inline-flex items-center gap-2 bg-primary-alt hover:bg-primary-light text-white px-6 py-3 rounded-md font-semibold">
                Shop Items
              </Link>

              <Link href="/orders" className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-md text-gray-700 hover:shadow-sm">
                Recent Orders
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>

            {loadingOrders ? (
              <div className="text-sm text-gray-500">Loading orders…</div>
            ) : ordersError ? (
              <div className="text-sm text-gray-500">{ordersError}. <Link href="/orders" className="text-amber-700 underline">View all orders</Link></div>
            ) : (!orders || orders.length === 0) ? (
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="text-gray-600">You have no recent orders. <Link href="/items" className="text-amber-700 underline">Start shopping</Link></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div key={order.orderId} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">Order #{order.orderId.split('-')[0]}</div>
                    <div className="font-medium">{order.orderItems?.length ?? 0} item{(order.orderItems?.length ?? 0) > 1 ? 's' : ''}</div>
                    <div className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()} • {order.orderStatus}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
