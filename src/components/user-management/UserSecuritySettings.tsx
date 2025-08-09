"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Switch from "../form/switch/Switch";
import Badge from "../ui/badge/Badge";

interface SecuritySettings {
  two_factor_enabled: boolean;
  password_last_changed: string;
  failed_login_attempts: number;
  account_locked: boolean;
  locked_until?: string;
  backup_codes_generated: boolean;
  session_timeout: number;
}

const mockSecuritySettings: SecuritySettings = {
  two_factor_enabled: false,
  password_last_changed: "2024-01-10T14:30:00Z",
  failed_login_attempts: 0,
  account_locked: false,
  backup_codes_generated: false,
  session_timeout: 3600
};

interface UserSecuritySettingsProps {
  userId?: string;
  onSettingsChange?: (settings: Partial<SecuritySettings>) => void;
}

export default function UserSecuritySettings({ userId, onSettingsChange }: UserSecuritySettingsProps) {
  const [settings, setSettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const { isOpen: isResetModalOpen, openModal: openResetModal, closeModal: closeResetModal } = useModal();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSettingToggle = (key: keyof SecuritySettings, value: boolean | number) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    if (onSettingsChange) {
      onSettingsChange({ [key]: value });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
    console.log("Changing password...", passwordForm);
    setShowPasswordModal(false);
    setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
  };

  const handleAccountUnlock = () => {
    handleSettingToggle("account_locked", false);
    handleSettingToggle("failed_login_attempts", 0);
    closeResetModal();
  };

  const generateBackupCodes = () => {
    // Generate backup codes logic
    handleSettingToggle("backup_codes_generated", true);
    console.log("Generating backup codes...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          Security Settings
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage user security preferences and authentication settings
        </p>
      </div>

      {/* Account Status */}
      <div className="border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="p-5 lg:p-6">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Account Status
          </h4>
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="p-4 border border-gray-200 rounded-xl dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Account Status
                </p>
                <Badge color={settings.account_locked ? "error" : "success"} size="sm">
                  {settings.account_locked ? "Locked" : "Active"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {settings.account_locked 
                  ? `Locked due to ${settings.failed_login_attempts} failed attempts`
                  : "Account is active and accessible"
                }
              </p>
              {settings.account_locked && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={openResetModal}
                >
                  Unlock Account
                </Button>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-xl dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Failed Login Attempts
                </p>
                <Badge 
                  color={settings.failed_login_attempts > 3 ? "error" : "light"} 
                  size="sm"
                >
                  {settings.failed_login_attempts}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recent failed login attempts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Security */}
      <div className="border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="p-5 lg:p-6">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Password Security
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Password Last Changed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(settings.password_last_changed)}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Session Timeout
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Auto-logout after {Math.floor(settings.session_timeout / 60)} minutes of inactivity
                </p>
              </div>
              <select
                value={settings.session_timeout}
                onChange={(e) => handleSettingToggle("session_timeout", parseInt(e.target.value))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 hour</option>
                <option value={7200}>2 hours</option>
                <option value={14400}>4 hours</option>
                <option value={28800}>8 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="p-5 lg:p-6">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Two-Factor Authentication
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Enable 2FA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to the account
                </p>
              </div>
              <Switch
                label=""
                defaultChecked={settings.two_factor_enabled}
                onChange={(checked) => {
                  if (checked) {
                    setShow2FAModal(true);
                  } else {
                    handleSettingToggle("two_factor_enabled", false);
                  }
                }}
              />
            </div>

            {settings.two_factor_enabled && (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Backup Codes
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {settings.backup_codes_generated 
                      ? "Backup codes have been generated"
                      : "Generate backup codes for account recovery"
                    }
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={generateBackupCodes}
                  disabled={settings.backup_codes_generated}
                >
                  {settings.backup_codes_generated ? "Generated" : "Generate Codes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </h4>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Account Unlock Modal */}
      <Modal isOpen={isResetModalOpen} onClose={closeResetModal} className="max-w-[400px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Unlock Account
          </h4>
          
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to unlock this account? This will reset the failed login attempts counter.
          </p>

          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={closeResetModal}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccountUnlock}
            >
              Unlock Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Enable Two-Factor Authentication
          </h4>
          
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Two-factor authentication adds an extra layer of security to your account.
          </p>

          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShow2FAModal(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                handleSettingToggle("two_factor_enabled", true);
                setShow2FAModal(false);
              }}
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}