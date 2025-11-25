'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Mail, Award, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/auth.store';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        bio: '',
        city: user?.city || '',
        country: user?.country || '',
        interests: [] as string[],
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/profile');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.put('/users/profile', profileData);
            updateUser(response.data.data);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-secondary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 rounded-full border-4 border-white/20"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-white text-4xl font-bold border-4 border-white/20">
                                {user.name[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex items-center gap-4 text-white/90">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    {user.rewardPoints || 0} Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="glass-strong rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <Button variant="outline" className="glass" onClick={() => router.push('/settings')}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-background opacity-60"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                rows={4}
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="city"
                                        type="text"
                                        value={profileData.city}
                                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                        className="bg-background pl-10"
                                        placeholder="San Francisco"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    type="text"
                                    value={profileData.country}
                                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                    className="bg-background"
                                    placeholder="United States"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="gradient-primary text-white px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="glass rounded-xl p-6 text-center">
                        <p className="text-3xl font-bold text-gradient-primary mb-2">12</p>
                        <p className="text-muted-foreground">Events Attended</p>
                    </div>
                    <div className="glass rounded-xl p-6 text-center">
                        <p className="text-3xl font-bold text-gradient-accent mb-2">
                            {user.rewardPoints || 0}
                        </p>
                        <p className="text-muted-foreground">Reward Points</p>
                    </div>
                    <div className="glass rounded-xl p-6 text-center">
                        <p className="text-3xl font-bold text-gradient-primary mb-2">5</p>
                        <p className="text-muted-foreground">Wishlist Items</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
