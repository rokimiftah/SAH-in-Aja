import { useCallback, useState } from "react";

import { useAction, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

interface CreditPackage {
  id: string;
  credits: number;
  amount: number;
  name: string;
  description: string;
  popular: boolean;
}

interface PaymentState {
  selectedPackage: string | null;
  isCreatingPayment: boolean;
  paymentLink: string | null;
  paymentError: string | null;
}

export function usePayment() {
  const packages = useQuery(api.mayar.getCreditPackages) as CreditPackage[] | undefined;
  const createPayment = useAction(api.mayar.createPayment);

  const [state, setState] = useState<PaymentState>({
    selectedPackage: null,
    isCreatingPayment: false,
    paymentLink: null,
    paymentError: null,
  });

  const selectPackage = useCallback((packageId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPackage: prev.selectedPackage === packageId ? null : packageId,
      paymentError: null,
    }));
  }, []);

  const initiatePayment = useCallback(async () => {
    if (!state.selectedPackage) return;

    setState((prev) => ({
      ...prev,
      isCreatingPayment: true,
      paymentError: null,
    }));

    try {
      const result = await createPayment({ packageId: state.selectedPackage });
      setState((prev) => ({
        ...prev,
        isCreatingPayment: false,
        paymentLink: result.paymentLink,
      }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat link pembayaran";
      setState((prev) => ({
        ...prev,
        isCreatingPayment: false,
        paymentError: errorMessage,
      }));
      throw error;
    }
  }, [state.selectedPackage, createPayment]);

  const resetPayment = useCallback(() => {
    setState({
      selectedPackage: null,
      isCreatingPayment: false,
      paymentLink: null,
      paymentError: null,
    });
  }, []);

  const selectedPackageData = state.selectedPackage ? packages?.find((p) => p.id === state.selectedPackage) : null;

  return {
    packages,
    selectedPackage: state.selectedPackage,
    selectedPackageData,
    isCreatingPayment: state.isCreatingPayment,
    paymentLink: state.paymentLink,
    paymentError: state.paymentError,
    selectPackage,
    initiatePayment,
    resetPayment,
  };
}
