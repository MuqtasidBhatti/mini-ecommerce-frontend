import { createContext, useContext, useState } from 'react'

const AuthModalContext = createContext()

export const AuthModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <AuthModalContext.Provider value={{ showModal, setShowModal }}>
            {children}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-neutral-900">Sign in to continue</h2>
                        <p className="text-sm text-neutral-500">You need an account to place an order.</p>
                        <div className="flex gap-3">
                            <a href="/login" className="flex-1 text-center py-2.5 rounded-xl bg-neutral-900 text-white text-sm">
                                Login
                            </a>
                            <a href="/register" className="flex-1 text-center py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-sm">
                                Register
                            </a>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-sm text-neutral-400 hover:text-neutral-900 text-center cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </AuthModalContext.Provider>
    )
}

export const useAuthModal = () => useContext(AuthModalContext)