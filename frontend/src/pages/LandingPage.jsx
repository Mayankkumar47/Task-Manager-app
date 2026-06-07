import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FaUsers, FaComments, FaExclamationCircle, 
  FaBell, FaClock, FaTags, FaCheckCircle, 
  FaMobileAlt, FaGooglePlay, FaApple 
} from "react-icons/fa"
import { playClick, playSuccess } from "../utils/soundEffects"

const LandingPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [firstTask, setFirstTask] = useState("")
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/user/dashboard", { replace: true })
      }
    }
  }, [currentUser, navigate])

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent_accepted")
    if (!consent) {
      setShowCookieBanner(true)
    }
  }, [])

  const handleAcceptCookies = () => {
    playClick()
    localStorage.setItem("cookie_consent_accepted", "true")
    setShowCookieBanner(false)
  }

  const handleTryForFree = (e) => {
    e.preventDefault()
    playClick()
    if (firstTask.trim()) {
      localStorage.setItem("first_task_prompt", firstTask.trim())
    }
    navigate("/signup")
  }

  const scrollToSection = (id) => {
    playClick()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 relative overflow-hidden font-sans select-none">
      
      {/* SaaS Background Gradients */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[60%] rounded-full bg-indigo-500/5 blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-20%] w-[70%] h-[60%] rounded-full bg-indigo-600/5 blur-[200px] pointer-events-none"></div>
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none"></div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 bg-[#070b13]/85 backdrop-blur-md border-b border-slate-900/60 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
            T
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-mono">TASKFLOW</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <button onClick={() => scrollToSection("features")} className="hover:text-white transition cursor-pointer">Features</button>
          <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition cursor-pointer">Pricing</button>
          <button onClick={() => scrollToSection("mobile")} className="hover:text-white transition cursor-pointer">Mobile App</button>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" onClick={playClick} className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition">
            Login
          </Link>
          <Link to="/signup" onClick={playClick} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow shadow-indigo-500/20">
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-6 py-20 text-center relative max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-900/40 rounded-full text-indigo-400 font-semibold text-[10px] uppercase tracking-wider select-none mb-2">
          ✨ Taskflow Workspace Platform v2
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white font-mono">
          Free To-Do lists for teams <br className="hidden sm:inline" />
          and individuals
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Manage tasks, collaborate with your teammates, track time, and secure quality deliverables under one unified SaaS workspace.
        </p>

        {/* HERO INTERACTIVE FORM */}
        <form onSubmit={handleTryForFree} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
          <input 
            type="text" 
            value={firstTask}
            onChange={(e) => setFirstTask(e.target.value)}
            placeholder="What's your first task? (e.g. Update portfolio)" 
            className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-800 text-slate-100 text-xs rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500"
          />
          <button 
            type="submit"
            className="px-6 py-3 btn-primary rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Try For Free
          </button>
        </form>

        <p className="text-[10px] text-slate-500 font-mono">
          No credit card required. Free forever, upgrade anytime.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="px-6 py-20 bg-slate-900/20 border-y border-slate-900/60 relative scroll-mt-10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-mono tracking-wide text-white uppercase">WORKSPACE FEATURES</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Everything you need to orchestrate projects</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 text-left">
            {[
              {
                icon: FaUsers,
                title: "Collaborate with Teammates",
                desc: "Assign tasks, share updates, and track progress together on interactive boards."
              },
              {
                icon: FaComments,
                title: "Turn tasks into Conversations",
                desc: "Discuss deliverables. Add comments directly inside individual task sheets."
              },
              {
                icon: FaExclamationCircle,
                title: "Prioritize Important Tasks",
                desc: "Sort backlogs using Low, Medium, and High weights to ensure urgent nodes get resolved."
              },
              {
                icon: FaBell,
                title: "Be Notified on Updates",
                desc: "Stay aligned on deadlines, comments, and task operations with instant alerts."
              },
              {
                icon: FaClock,
                title: "Built-in Time Tracking",
                desc: "Track active hours spent on assignments using task stopwatch controls."
              },
              {
                icon: FaTags,
                title: "Custom Tags",
                desc: "Filter, prioritize, and isolate items at a glance with color-coded labels."
              },
              {
                icon: FaCheckCircle,
                title: "Quality with Approvals",
                desc: "Verify project milestones by requesting and logging official supervisor approvals."
              }
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border-slate-800/80 hover:border-indigo-500/20 space-y-3.5 bg-slate-900/35">
                <div className="p-3 bg-indigo-950/60 border border-indigo-900/40 rounded-xl w-fit">
                  <feature.icon className="text-indigo-400 text-sm" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 tracking-wide font-mono uppercase">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="px-6 py-20 relative scroll-mt-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-mono tracking-wide text-white uppercase">FLEXIBLE PRICING</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Free Forever, Upgrade Anytime</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-4 text-left">
            {/* FREE PLAN */}
            <div className="glass-panel p-6 rounded-2xl border-slate-800/80 bg-slate-900/35 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest">FREE TIER</span>
                <h3 className="text-lg font-bold text-white font-mono uppercase pt-1">Free Plan</h3>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-2xl font-black text-white font-mono">$0</span>
                  <span className="text-xs text-slate-500">/ seat / month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li className="flex items-center gap-2">✓ Up to 5 user seats</li>
                <li className="flex items-center gap-2">✓ Up to 200 tasks total</li>
                <li className="flex items-center gap-2">✓ 3 active projects</li>
                <li className="flex items-center gap-2">✓ 500 MB media storage</li>
                <li className="flex items-center gap-2">✓ Mobile app accessibility</li>
              </ul>
              <Link to="/signup" onClick={playClick} className="w-full text-center py-2.5 btn-secondary rounded-xl text-xs font-bold uppercase tracking-wider block">
                Start Free
              </Link>
            </div>

            {/* PRO PLAN */}
            <div className="glass-panel p-6 rounded-2xl border-indigo-500/40 bg-slate-900/45 flex flex-col justify-between space-y-6 relative shadow-lg shadow-indigo-500/5">
              <div className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 bg-indigo-600 text-white rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                POPULAR
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold bg-indigo-950/60 border border-indigo-900/40 px-2 py-0.5 rounded text-indigo-400 uppercase tracking-widest">PRO TIER</span>
                <h3 className="text-lg font-bold text-white font-mono uppercase pt-1">Pro Plan</h3>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-2xl font-black text-white font-mono">$4</span>
                  <span className="text-xs text-slate-500">/ seat / month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-350 font-medium">
                <li className="flex items-center gap-2 text-indigo-400">✓ No seats limits</li>
                <li className="flex items-center gap-2 text-indigo-400">✓ Unlimited tasks registry</li>
                <li className="flex items-center gap-2">✓ Stopwatch time tracking</li>
                <li className="flex items-center gap-2">✓ Task conversation threads</li>
                <li className="flex items-center gap-2">✓ Peer approval requests</li>
              </ul>
              <Link to="/signup" onClick={playClick} className="w-full text-center py-2.5 btn-primary rounded-xl text-xs font-bold uppercase tracking-wider block shadow-md shadow-indigo-500/20">
                Upgrade Pro
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* MOBILE APP SHOWCASE */}
      <section id="mobile" className="px-6 py-20 bg-slate-900/10 border-t border-slate-900/60 relative scroll-mt-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-5 text-left max-w-md">
            <div className="flex items-center gap-2">
              <FaMobileAlt className="text-indigo-400 text-lg animate-pulse" />
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Mobile Companion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-mono">
              Download the mobile app
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              Take your tasks on the go. Sync data instantly and orchestrate lists on our lighting-fast mobile application. Available for iOS and Android.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={playClick} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition cursor-pointer">
                <FaGooglePlay className="text-sm" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Google Play</span>
              </button>
              <button onClick={playClick} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl text-slate-300 hover:text-white transition cursor-pointer">
                <FaApple className="text-sm" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">App Store</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-[280px] h-[360px] bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl relative flex flex-col justify-between shrink-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
            {/* Mini task list mock */}
            <div className="space-y-3 pt-3">
              <div className="w-16 h-3 bg-slate-800 rounded-md"></div>
              <div className="h-6 w-full bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-1.5 flex justify-between items-center">
                <div className="w-1/2 h-2.5 bg-indigo-400/30 rounded"></div>
                <div className="w-3 h-3 rounded bg-indigo-500"></div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-full bg-slate-900 border border-slate-800/80 rounded-lg p-1.5 flex justify-between items-center">
                  <div className="w-2/3 h-2 bg-slate-750 rounded"></div>
                  <div className="w-3 h-3 rounded-full border border-slate-700"></div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 border-t border-slate-800/60 pt-3 text-[9px] font-mono text-slate-500 justify-center">
              <span>ACTIVE SYNC: SUCCESSFUL</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-slate-900/60 bg-slate-950/40 text-center text-[10px] font-mono text-slate-500 space-y-4">
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold">
          <button onClick={() => playClick()} className="hover:text-white transition cursor-pointer">Pricing</button>
          <button onClick={() => playClick()} className="hover:text-white transition cursor-pointer">Contact Us</button>
          <button onClick={() => playClick()} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
          <button onClick={() => playClick()} className="hover:text-white transition cursor-pointer">Terms of Use</button>
        </div>
        <p className="font-sans font-medium text-slate-600">&copy; {new Date().getFullYear()} Taskflow Workspace Inc. All rights reserved.</p>
      </footer>

      {/* COOKIE CONSENT BANNER */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 border-t border-slate-900 shadow-2xl z-50 flex flex-col md:flex-row items-center justify-between gap-4 font-sans"
          >
            <p className="text-[11px] text-slate-400 text-left max-w-3xl leading-relaxed">
              We use cookies to personalize content and analyze web traffic. Read more in our{" "}
              <button onClick={playClick} className="text-indigo-400 underline hover:text-indigo-300 font-bold cursor-pointer">Privacy Policy</button> and{" "}
              <button onClick={playClick} className="text-indigo-400 underline hover:text-indigo-300 font-bold cursor-pointer">Terms & Conditions</button>.
            </p>
            <button
              onClick={handleAcceptCookies}
              className="px-5 py-2 btn-primary rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              Accept Cookies
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default LandingPage
