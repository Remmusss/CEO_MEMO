import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  // In a real application, we would check if the user is authenticated
  // If not authenticated, show the login page
  // If authenticated, redirect to the dashboard

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            HR & Payroll System
          </CardTitle>
          <CardDescription>Login to access the HR and payroll management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

