import React from 'react';
import { Button } from '../ui/button';

interface WalletInfo {
  extensionName: string;
  title: string;
  logo?: {
    src: string;
    alt: string;
  };
  installed: boolean;
  installUrl?: string;
}

interface WalletOptionProps {
  wallet: WalletInfo;
  onConnect: (extensionName: string) => void;
  isConnecting?: boolean;
  disabled?: boolean;
}

export const WalletOption: React.FC<WalletOptionProps> = ({
  wallet,
  onConnect,
  isConnecting = false,
  disabled = false,
}) => {
  if (!wallet.installed) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          {wallet.logo && (
            <img src={wallet.logo.src} alt={wallet.logo.alt || wallet.title} className="w-8 h-8" />
          )}
          <div>
            <span className="font-medium">{wallet.title}</span>
            <p className="text-sm text-gray-500">Not installed</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href={wallet.installUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[80px]"
          >
            Install
          </a>
        </Button>
      </div>
    );
  }

  const isDisabled = isConnecting || disabled;

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
        isDisabled ? 'opacity-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {wallet.logo && (
          <img src={wallet.logo.src} alt={wallet.logo.alt || wallet.title} className="w-8 h-8" />
        )}
        <div>
          <span className="font-medium">{wallet.title}</span>
          <p className="text-sm text-gray-500">
            {isConnecting ? 'Connecting...' : disabled ? 'Please wait...' : 'Ready to connect'}
          </p>
        </div>
      </div>
      <Button
        onClick={() => onConnect(wallet.extensionName)}
        disabled={isDisabled}
        className="min-w-[80px]"
      >
        {isConnecting ? 'Connecting...' : 'Connect'}
      </Button>
    </div>
  );
};
