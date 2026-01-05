import { SignUp } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
            {/* Star Animation Background */}
            <div className="star-animation fixed inset-0 pointer-events-none">
                {Array.from({ length: 50 }, (_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center ai-icon-glow">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white font-display">AI Fiesta Chat</span>
                </div>

                {/* Sign Up Component */}
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "glass-effect shadow-2xl rounded-2xl border-white/10",
                            headerTitle: "text-white font-bold",
                            headerSubtitle: "text-gray-300",
                            socialButtonsBlockButton: "glass-effect border-white/20 text-white hover:bg-white/10 transition-all",
                            socialButtonsBlockButtonText: "text-white font-medium",
                            dividerLine: "bg-white/20",
                            dividerText: "text-gray-400",
                            formFieldLabel: "text-gray-300",
                            formFieldInput: "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500",
                            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg shadow-purple-500/30",
                            footerActionLink: "text-purple-400 hover:text-purple-300",
                        },
                    }}
                />

                {/* Tagline */}
                <p className="mt-6 text-center text-gray-400 text-sm max-w-xs">
                    Compare AI responses side-by-side. Get the best answer every time.
                </p>
            </div>
        </div>
    );
}
