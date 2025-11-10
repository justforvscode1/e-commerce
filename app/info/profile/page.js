"use client";

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccountProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (status === 'loading') return;


    fetchUserProfile();
  }, [status]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const userData = await response.json();
      setUser(userData);
      console.log(userData)
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProviderIcon = (provider) => {
    const icons = {
      google: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      discord: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.8 8.18 1.8 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029a19.94 19.94 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
        </svg>
      ),
      credentials: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    };
    return icons[provider] || null;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                {user?.profileImage || session.user?.image ? (
                  <Image
                    src={user?.profileImage || session.user?.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-light text-gray-600">
                    {user?.firstName?.[0]?.toUpperCase() || session.user?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : session.user?.name || 'User'
                }
              </h1>
              <p className="text-gray-600 mb-4">{session.user?.email}</p>

              <div className="flex flex-wrap gap-2">
                {user?.isEmailVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    Verified
                  </span>
                )}
                {user?.isActive && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Active
                  </span>
                )}
                {user?.createdAt && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    Member since {formatDate(user.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg border border-gray-200 p-6 space-y-1 sticky top-8">
              {[
                { id: 'profile', name: 'Profile Information' },
                { id: 'security', name: 'Security' },
                { id: 'activity', name: 'Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTab === tab.id
                      ? 'bg-gray-50 text-gray-900 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="p-3 text-gray-900 bg-gray-50 rounded border border-gray-200 text-sm">
                        {user?.firstName || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="p-3 text-gray-900 bg-gray-50 rounded border border-gray-200 text-sm">
                        {user?.lastName || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="p-3 text-gray-900 bg-gray-50 rounded border border-gray-200 text-sm flex items-center justify-between">
                      <span>{session.user?.email}</span>
                      {user?.isEmailVerified && (
                        <span className="text-green-600 text-xs font-medium">Verified</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  {/* Authentication Methods */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Connected Accounts</h3>
                    <div className="space-y-3">
                      {Object.entries(user?.linkedAccounts || {}).map(([provider, connected]) => (
                        connected ? (
                          <div key={provider} className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">

                           <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-white rounded border border-gray-200">
                                {getProviderIcon(provider)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {provider === 'credentials' ? 'Email & Password' : provider}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {connected ? 'Connected' : 'Not connected'}
                                </p>
                              </div>
                            </div>

                          </div>
                        ):''
                      ))}
                    </div>
                  </div>

                  {/* Password Section */}
                  {user?.hasPassword && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Password</h3>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && user && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Account Activity</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Last Login</h3>
                      <p className="text-sm text-gray-900">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Account Created</h3>
                      <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}