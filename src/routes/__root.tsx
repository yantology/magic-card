import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Footer from '@/components/custom/Footer'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  ),
})
