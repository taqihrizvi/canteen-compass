import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your platform preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* General Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">General Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Platform Name</p>
                <p className="text-sm text-muted-foreground">CanteenAI Smart Catering</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Time Zone</p>
                <p className="text-sm text-muted-foreground">GMT (London)</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-foreground">Currency</p>
                <p className="text-sm text-muted-foreground">GBP (£)</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when items are low</p>
              </div>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">Enabled</Button>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Daily Reports</p>
                <p className="text-sm text-muted-foreground">Receive daily summary emails</p>
              </div>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">Enabled</Button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-foreground">AI Recommendations</p>
                <p className="text-sm text-muted-foreground">Get AI-powered insights</p>
              </div>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">Enabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">Data & Privacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Data Encryption</p>
                <p className="text-sm text-muted-foreground">All data encrypted at rest and in transit</p>
              </div>
              <Button variant="outline" size="sm" className="bg-success text-success-foreground">Active</Button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your platform data</p>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Database className="w-5 h-5 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">POS System</p>
                <p className="text-sm text-muted-foreground">Connect your point of sale</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-foreground">Payment Gateway</p>
                <p className="text-sm text-muted-foreground">Setup payment processing</p>
              </div>
              <Button variant="outline" size="sm">Setup</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
