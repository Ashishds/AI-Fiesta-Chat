"use client";

import { SignInButton } from "@clerk/nextjs";
import { Sparkles, MessageSquare, Zap, Globe, Shield, Clock, Users, ArrowRight, Star, CheckCircle } from "lucide-react";

// Star component for the twinkling effect
function TwinkleStar({ style }: { style: React.CSSProperties }) {
    return <div className="star" style={style} />;
}

// Feature card component with enhanced styling
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="glass-effect rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 group hover:transform hover:scale-[1.02]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-5 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all">
                <Icon className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">{title}</h3>
            <p className="text-gray-400 text-base leading-relaxed">{description}</p>
        </div>
    );
}

// AI Model badge component
function AIModelBadge({ name, color, icon }: { name: string; color: string; icon: string }) {
    return (
        <div className={`glass-effect px-5 py-3 rounded-full flex items-center gap-3 ${color} hover:scale-105 transition-transform cursor-default`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-semibold">{name}</span>
        </div>
    );
}

// Stats component
function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
        </div>
    );
}

// Testimonial component
function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
    return (
        <div className="glass-effect rounded-2xl p-6 flex flex-col">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">&ldquo;{quote}&rdquo;</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                </div>
                <div>
                    <div className="text-white font-medium text-sm">{author}</div>
                    <div className="text-gray-500 text-xs">{role}</div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    // Generate stars with random positions
    const stars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
    }));

    return (
        <div className="min-h-screen hero-gradient overflow-hidden">
            {/* Star Animation Background */}
            <div className="star-animation fixed inset-0 pointer-events-none">
                {stars.map((star) => (
                    <TwinkleStar
                        key={star.id}
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.animationDelay,
                            animationDuration: star.animationDuration,
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-16">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center ai-icon-glow shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-display font-bold text-xl text-white tracking-tight">AI Fiesta Chat</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/chat" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hidden sm:block">
                        Try for Free
                    </a>
                    <SignInButton mode="modal">
                        <button className="shiny-cta bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 lg:px-16 py-16 lg:py-28">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-8 border border-purple-500/20">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-black/50" />
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-black/50" />
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-black/50" />
                        </div>
                        <span className="text-sm text-gray-300 font-medium">Trusted by 5,000+ users</span>
                        <div className="flex gap-0.5 ml-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
                        <span className="gradient-text">One Chat, Multiple</span><br />
                        <span className="gradient-text">AI Minds</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Stop paying for multiple AI subscriptions. Get responses from <strong className="text-white">GPT-4o, Llama 3,</strong> and <strong className="text-white">Perplexity</strong> in one interface. Compare answers side-by-side and find the best response—<span className="text-purple-400">instantly</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <a href="/chat">
                            <button className="shiny-cta bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl shadow-green-500/25 flex items-center gap-3 mx-auto sm:mx-0 group">
                                Start Chatting Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </a>
                        <a href="#features">
                            <button className="glass-effect text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-3 mx-auto sm:mx-0 border border-white/10">
                                See How It Works
                            </button>
                        </a>
                    </div>

                    {/* No Credit Card Badge */}
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-12">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>No credit card required</span>
                        <span className="mx-2">•</span>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Free tier available</span>
                    </div>

                    {/* AI Model Badges */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <AIModelBadge name="GPT-4o Mini" color="text-green-400" icon="🤖" />
                        <AIModelBadge name="Groq Llama" color="text-orange-400" icon="⚡" />
                        <AIModelBadge name="Perplexity" color="text-cyan-400" icon="🔮" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 lg:px-16 py-12 border-y border-white/5">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem value="3" label="AI Models" />
                    <StatItem value="<1s" label="Response Time" />
                    <StatItem value="∞" label="Parallel Chats" />
                    <StatItem value="99.9%" label="Uptime" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 px-6 lg:px-16 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-4">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">Powerful Features</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Built for developers, researchers, and anyone who wants the best AI responses
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={MessageSquare}
                            title="Multi-Model Responses"
                            description="Send one prompt, get responses from multiple AI models. Compare quality, style, and accuracy in real-time."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Ultra-Fast Inference"
                            description="Powered by Groq's lightning-fast inference engine. Get responses in under a second, every time."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Rich Markdown"
                            description="Code blocks, tables, math equations—everything rendered beautifully with syntax highlighting."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Secure by Default"
                            description="Enterprise-grade security with Clerk authentication. Your conversations are private and encrypted."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Conversation History"
                            description="Never lose a chat. Your entire conversation history is saved and searchable across sessions."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Guest Access"
                            description="No sign-up required to start chatting. Try it instantly, save your history when you're ready."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative z-10 px-6 lg:px-16 py-20 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            Loved by Users
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            See what our community is saying
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="Finally, I don't need 5 different AI subscriptions. This saves me hours every week comparing responses."
                            author="Sarah Chen"
                            role="Product Manager"
                            avatar="SC"
                        />
                        <TestimonialCard
                            quote="The speed is incredible. I get responses from all three models before I even finish reading the first one."
                            author="Marcus Johnson"
                            role="Software Engineer"
                            avatar="MJ"
                        />
                        <TestimonialCard
                            quote="Perfect for research. I can see how different models interpret the same question and pick the best answer."
                            author="Emily Rodriguez"
                            role="Data Scientist"
                            avatar="ER"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative z-10 px-6 lg:px-16 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                        Ready to Experience the Future?
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of users who are already getting better AI responses. Start for free, no credit card required.
                    </p>
                    <a href="/chat">
                        <button className="shiny-cta bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-purple-500 hover:to-cyan-400 transition-all shadow-2xl shadow-purple-500/25 flex items-center gap-3 mx-auto group">
                            Get Started Now — It&apos;s Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 lg:px-16 py-10 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-semibold">AI Fiesta Chat</span>
                        </div>
                        <div className="flex items-center gap-6 text-gray-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2026 AI Fiesta Chat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
