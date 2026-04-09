import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function ConnectionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, isLoading } = useNetworkStatus();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const isOnOfflineScreen = segments[0] === "offline";

    if (!isConnected && !isOnOfflineScreen) {
      router.replace("/offline");
    }

    if (isConnected && isOnOfflineScreen) {
      router.replace("/");
    }
  }, [isConnected, isLoading, segments]);

  return <>{children}</>;
}
