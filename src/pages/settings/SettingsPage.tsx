/**
 * Settings page — shop profile and business hours editor.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop, useUpdateBusinessHours, useUpdateShop } from '@/hooks/useShop';
import { useConnectMeta, useConnections, useDisconnectConnection, useManualConnect } from '@/hooks/useConnections';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/common/PageHeader';
import { WhatsAppConnectionCard } from '@/components/connections/WhatsAppConnectionCard';
import type { UpdateProfileFormValues } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_number: z.string().optional(),
});

const WEEKDAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const DEFAULT_HOURS = '09:00-18:00';

export const SettingsPage: React.FC = () => {
  const { data: shop, isLoading } = useShop();
  const updateShop = useUpdateShop();
  const updateHours = useUpdateBusinessHours();
  const connections = useConnections();
  const connectMeta = useConnectMeta();
  const disconnectConnection = useDisconnectConnection();
  const manualConnect = useManualConnect();

  const [showManualForm, setShowManualForm] = React.useState(false);
  const [manualFields, setManualFields] = React.useState({
    phone_number_id: '',
    waba_id: '',
    display_phone_number: '',
    access_token: '',
  });
  const location = useLocation();
  const navigate = useNavigate();

  const whatsappConnection = connections.data?.find(
    (c) => c.platform === 'whatsapp'
  );

  const [hoursState, setHoursState] = React.useState<Record<string, string>>({});
  const [hoursInitialised, setHoursInitialised] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Populate form once shop loads
  React.useEffect(() => {
    if (shop && !hoursInitialised) {
      reset({ name: shop.name, phone_number: shop.phone_number ?? '' });
      setHoursState(
        Object.fromEntries(
          WEEKDAYS.map(({ key }) => [key, shop.business_hours?.[key] ?? DEFAULT_HOURS])
        )
      );
      setHoursInitialised(true);
    }
  }, [shop, hoursInitialised, reset]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('connection');
    const reason = params.get('reason');
    if (!status) return;

    if (status === 'success') {
      toast.success('WhatsApp connected');
    } else {
      toast.error(reason ?? 'Unable to connect WhatsApp');
    }

    params.delete('connection');
    params.delete('reason');
    navigate({ search: params.toString() }, { replace: true });
  }, [location.search, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const handleDisconnect = (id: string) => {
    if (window.confirm('Disconnect WhatsApp? This will stop all automated messaging.')) {
      disconnectConnection.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your shop profile and hours" />

      {/* Connected accounts */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Connected Accounts</p>
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Business</h2>
          </div>
          {!whatsappConnection && (
            <Button
              variant="secondary"
              size="sm"
              loading={connectMeta.isPending}
              onClick={() => connectMeta.mutate()}
            >
              + Connect WhatsApp
            </Button>
          )}
        </div>
        <div className="mt-4">
          <WhatsAppConnectionCard
            connection={whatsappConnection}
            onConnect={() => connectMeta.mutate()}
            onDisconnect={handleDisconnect}
            isConnecting={connectMeta.isPending}
            isDisconnecting={disconnectConnection.isPending}
          />
        </div>

        {/* Manual connect for Meta test/demo accounts */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowManualForm((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {showManualForm ? 'Hide' : 'Connect using Meta test account credentials'}
          </button>

          {showManualForm && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-gray-500">
                Get these values from{' '}
                <strong>Meta Developer → WhatsApp → API Testing</strong>
              </p>
              {[
                { key: 'phone_number_id', label: 'Phone Number ID' },
                { key: 'waba_id', label: 'WhatsApp Business Account ID' },
                { key: 'display_phone_number', label: 'Display Phone Number (e.g. +1 555 123 4567)' },
                { key: 'access_token', label: 'Access Token' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type={key === 'access_token' ? 'password' : 'text'}
                    value={manualFields[key as keyof typeof manualFields]}
                    onChange={(e) => setManualFields((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder={label}
                  />
                </div>
              ))}
              <Button
                size="sm"
                loading={manualConnect.isPending}
                onClick={() => manualConnect.mutate(manualFields)}
                disabled={!manualFields.phone_number_id || !manualFields.waba_id || !manualFields.access_token}
              >
                Save Connection
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Shop profile */}
      <Card>
        <h2 className="mb-4 font-semibold text-gray-900">Shop Profile</h2>
        <form
          onSubmit={handleSubmit((d) => updateShop.mutate(d))}
          className="space-y-4"
        >
          <Input
            label="Shop name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email address"
            type="email"
            value={shop?.email ?? ''}
            disabled
            helperText="Email cannot be changed after registration"
          />
          <Input
            label="WhatsApp phone number"
            type="tel"
            placeholder="+919876543210"
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />
          <Button type="submit" loading={updateShop.isPending}>
            Save Profile
          </Button>
        </form>
      </Card>

      {/* Business hours */}
      <Card>
        <h2 className="mb-1 font-semibold text-gray-900">Business Hours</h2>
        <p className="mb-4 text-sm text-gray-500">
          Format: <code className="bg-gray-100 px-1 rounded text-xs">09:00-18:00</code> or{' '}
          <code className="bg-gray-100 px-1 rounded text-xs">closed</code>
        </p>
        <div className="space-y-3">
          {WEEKDAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-700">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`open-${key}`}
                  checked={hoursState[key] !== 'closed'}
                  onChange={(e) =>
                    setHoursState((prev) => ({
                      ...prev,
                      [key]: e.target.checked ? DEFAULT_HOURS : 'closed',
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor={`open-${key}`} className="text-xs text-gray-500">
                  Open
                </label>
              </div>
              {hoursState[key] !== 'closed' && (
                <input
                  type="text"
                  value={hoursState[key] ?? DEFAULT_HOURS}
                  onChange={(e) =>
                    setHoursState((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  placeholder="09:00-18:00"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Button
            onClick={() => updateHours.mutate(hoursState)}
            loading={updateHours.isPending}
          >
            Save Hours
          </Button>
        </div>
      </Card>
    </div>
  );
};
