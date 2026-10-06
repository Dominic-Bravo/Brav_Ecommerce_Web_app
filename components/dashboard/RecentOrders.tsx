const orders = [
  {
    id: "#BRV-1001",
    customer: "John Doe",
    product: "Premium T-Shirt",
    amount: "₱1,499",
    status: "Completed",
  },
  {
    id: "#BRV-1002",
    customer: "Maria Santos",
    product: "Classic Sneakers",
    amount: "₱3,299",
    status: "Processing",
  },
  {
    id: "#BRV-1003",
    customer: "James Cruz",
    product: "Leather Bag",
    amount: "₱2,899",
    status: "Pending",
  },
];

export default function RecentOrders() {
  return (
    <div className="rounded-brav-lg border border-brav-border bg-white">
      <div className="flex items-center justify-between border-b border-brav-border p-6">
        <div>
          <h2 className="font-semibold">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-brav-muted">
            Your latest orders
          </p>
        </div>

        <button className="text-sm font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brav-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">
                Order
              </th>

              <th className="px-6 py-4 font-medium">
                Customer
              </th>

              <th className="px-6 py-4 font-medium">
                Product
              </th>

              <th className="px-6 py-4 font-medium">
                Amount
              </th>

              <th className="px-6 py-4 font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-brav-border"
              >
                <td className="px-6 py-4 font-medium">
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  {order.customer}
                </td>

                <td className="px-6 py-4">
                  {order.product}
                </td>

                <td className="px-6 py-4">
                  {order.amount}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-brav-secondary px-3 py-1 text-xs">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}