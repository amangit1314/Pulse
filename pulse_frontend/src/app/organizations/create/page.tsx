'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { organizationsService } from '@/services/organizations.service';
import { dmSans, spaceGrotesk } from '@/lib/fonts';

export default function CreateOrganizationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        logo: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name' && !formData.slug) {
            const autoSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setFormData((prev) => ({ ...prev, slug: autoSlug }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'Website must start with http:// or https://';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Only send non-empty fields
            const submitData: any = {
                name: formData.name,
                slug: formData.slug,
            };

            if (formData.description) submitData.description = formData.description;
            if (formData.website) submitData.website = formData.website;
            if (formData.email) submitData.email = formData.email;
            if (formData.phone) submitData.phone = formData.phone;
            if (formData.address) submitData.address = formData.address;
            if (formData.city) submitData.city = formData.city;
            if (formData.state) submitData.state = formData.state;
            if (formData.country) submitData.country = formData.country;
            if (formData.postalCode) submitData.postalCode = formData.postalCode;
            if (formData.logo) submitData.logo = formData.logo;

            const organization = await organizationsService.createOrganization(submitData);

            setSuccess(true);

            // Redirect to the organization page after a brief delay
            setTimeout(() => {
                router.push(`/organizations/${organization.slug}`);
            }, 1500);
        } catch (err: any) {
            console.error('Failed to create organization:', err);
            setError(err.response?.data?.message || 'Failed to create organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-2`}>
                        Organization Created!
                    </h2>
                    <p className={`${dmSans.className} text-muted-foreground`}>
                        Redirecting to your organization...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="gradient-primary py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/organizations"
                        className={`${dmSans.className} inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Organizations
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl glass-strong flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-white`}>
                                Create Organization
                            </h1>
                            <p className={`${dmSans.className} text-white/90`}>
                                Set up your organization profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="glass-strong rounded-xl p-6">
                        <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-6`}>
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className={dmSans.className}>
                                    Organization Name <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="e.g., TechCorp Events"
                                />
                                {errors.name && (
                                    <p className={`${dmSans.className} text-sm text-red-400 mt-1`}>{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="slug" className={dmSans.className}>
                                    URL Slug <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.slug ? 'border-red-500' : ''}`}
                                    placeholder="e.g., techcorp-events"
                                />
                                <p className={`${dmSans.className} text-xs text-muted-foreground mt-1`}>
                                    This will be used in your organization's URL
                                </p>
                                {errors.slug && (
                                    <p className={`${dmSans.className} text-sm text-red-400 mt-1`}>{errors.slug}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description" className={dmSans.className}>
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="bg-background min-h-[120px]"
                                    placeholder="Tell people about your organization..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="logo" className={dmSans.className}>
                                    Logo URL
                                </Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    type="url"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    className="bg-background"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="glass-strong rounded-xl p-6">
                        <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-6`}>
                            Contact Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="website" className={dmSans.className}>
                                    Website
                                </Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.website ? 'border-red-500' : ''}`}
                                    placeholder="https://example.com"
                                />
                                {errors.website && (
                                    <p className={`${dmSans.className} text-sm text-red-400 mt-1`}>{errors.website}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className={dmSans.className}>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="contact@example.com"
                                />
                                {errors.email && (
                                    <p className={`${dmSans.className} text-sm text-red-400 mt-1`}>{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone" className={dmSans.className}>
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="bg-background"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="glass-strong rounded-xl p-6">
                        <h2 className={`${spaceGrotesk.className} text-2xl font-bold mb-6`}>
                            Address
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="address" className={dmSans.className}>
                                    Street Address
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="bg-background"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city" className={dmSans.className}>
                                        City
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="bg-background"
                                        placeholder="San Francisco"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state" className={dmSans.className}>
                                        State/Province
                                    </Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        type="text"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="bg-background"
                                        placeholder="California"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="country" className={dmSans.className}>
                                        Country
                                    </Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        type="text"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="bg-background"
                                        placeholder="United States"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="postalCode" className={dmSans.className}>
                                        Postal Code
                                    </Label>
                                    <Input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="bg-background"
                                        placeholder="94102"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="glass-strong rounded-xl p-4 border border-red-500/50 bg-red-500/10">
                            <p className={`${dmSans.className} text-red-400`}>{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className={`${dmSans.className} flex-1 gradient-primary text-white`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Organization'
                            )}
                        </Button>

                        <Link href="/organizations">
                            <Button type="button" variant="outline" className={`${dmSans.className} glass`}>
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
