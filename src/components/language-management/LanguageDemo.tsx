'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageDemo() {
  const { t, language } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🌐</span>
          Language Demo - Current: {language.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Translations */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Common Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">{t('common.save')}</Button>
            <Button size="sm" variant="outline">{t('common.cancel')}</Button>
            <Button size="sm" variant="outline">{t('common.delete')}</Button>
            <Button size="sm" variant="outline">{t('common.edit')}</Button>
          </div>
        </div>

        {/* Navigation Translations */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Navigation</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="light">{t('navigation.dashboard')}</Badge>
            <Badge variant="light">{t('navigation.users')}</Badge>
            <Badge variant="light">{t('navigation.sales')}</Badge>
            <Badge variant="light">{t('navigation.inventory')}</Badge>
            <Badge variant="light">{t('navigation.finance')}</Badge>
          </div>
        </div>

        {/* Auth Translations */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Authentication</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>{t('auth.signIn')}:</strong> {t('auth.signInToAccount')}</p>
            <p><strong>{t('auth.signUp')}:</strong> {t('auth.createNewAccount')}</p>
            <p><strong>{t('auth.welcomeBack')}:</strong> {t('auth.enterEmail')}</p>
          </div>
        </div>

        {/* Dashboard Translations */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dashboard</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="font-medium text-blue-900 dark:text-blue-100">{t('dashboard.totalUsers')}</div>
              <div className="text-blue-600 dark:text-blue-400">1,234</div>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="font-medium text-green-900 dark:text-green-100">{t('dashboard.activeUsers')}</div>
              <div className="text-green-600 dark:text-green-400">987</div>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="font-medium text-yellow-900 dark:text-yellow-100">{t('dashboard.totalSales')}</div>
              <div className="text-yellow-600 dark:text-yellow-400">$45,678</div>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="font-medium text-purple-900 dark:text-purple-100">{t('dashboard.monthlyRevenue')}</div>
              <div className="text-purple-600 dark:text-purple-400">$12,345</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Status Messages</h3>
          <div className="space-y-1 text-sm">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-800 dark:text-green-200">
              ✅ {t('messages.dataSaved')}
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-800 dark:text-blue-200">
              ℹ️ {t('messages.dataLoaded')}
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
              ⚠️ {t('messages.pleaseWait')}
            </div>
          </div>
        </div>

        {/* Language Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p><strong>Current Language:</strong> {language === 'en' ? 'English' : 'বাংলা'}</p>
            <p><strong>Total Keys Loaded:</strong> {Object.keys(t('common') || {}).length + Object.keys(t('navigation') || {}).length + Object.keys(t('auth') || {}).length}</p>
            <p><strong>Switch Language:</strong> Use the language toggle in the header (🇺🇸/🇧🇩)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}