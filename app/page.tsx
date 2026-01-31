import Link from "next/link"
import { Calendar, Shield, BarChart3, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CampusSync</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Streamline Campus Operations</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Unified Campus
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Resource & Event Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Seamlessly manage events, book resources, and track engagement across your entire campus with our intelligent management platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary text-lg flex items-center gap-2">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-secondary text-lg">
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { value: "500+", label: "Events Managed" },
              { value: "50+", label: "Active Clubs" },
              { value: "10K+", label: "Students" },
              { value: "99%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete solution for managing campus events, resources, and engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Automatic conflict detection ensures no double bookings. Real-time availability checks for all resources.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Role-Based Access",
                description: "Secure RBAC system with Admin, Organizer, and Participant roles. Each with tailored permissions.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BarChart3,
                title: "Live Analytics",
                description: "Track resource utilization, event attendance, and club engagement with beautiful real-time charts.",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Users,
                title: "Club Management",
                description: "Multi-club collaboration for events. Easy membership management and communication tools.",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: Zap,
                title: "Instant Notifications",
                description: "Real-time alerts for event approvals, booking confirmations, and important updates.",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: CheckCircle,
                title: "Approval Workflow",
                description: "Streamlined event approval process with multi-stage review and automatic notifications.",
                color: "from-violet-500 to-purple-500"
              },
            ].map((feature, i) => (
              <div key={i} className="group bg-card rounded-2xl p-8 border border-border card-hover">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account and select your role (Student, Organizer, or Admin)." },
              { step: "02", title: "Explore", desc: "Browse events, check resource availability, or create your own event." },
              { step: "03", title: "Engage", desc: "Register for events, book resources, and track everything from your dashboard." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-muted/30 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative pt-12 pl-4">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="relative px-8 py-16 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Campus?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students and organizers already using CampusSync to streamline their events.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">CampusSync</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 CampusSync. Built for IIT Goa.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
