import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function completeIndividualProfileStep(
  user: ReturnType<typeof userEvent.setup>,
  options?: {
    address?: string;
    contact?: string;
    profileImage?: File;
  }
) {
  const address = options?.address ?? '456 Author Street';
  const contact = options?.contact ?? '+1 555 0200';

  await user.click(screen.getByRole('button', { name: /individual/i }));
  await user.click(screen.getByRole('button', { name: /continue/i }));
  await user.type(screen.getByLabelText(/first name/i), 'Jane');
  await user.type(screen.getByLabelText(/last name/i), 'Author');
  await user.type(screen.getByLabelText(/^email$/i), 'author@example.com');
  await user.type(screen.getByLabelText(/^address/i), address);
  await user.type(screen.getByLabelText(/contact number/i), contact);

  if (options?.profileImage) {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(fileInput, options.profileImage);
  }

  await user.click(screen.getByRole('button', { name: /continue/i }));
}

export async function completeIndividualSecurityStep(
  user: ReturnType<typeof userEvent.setup>
) {
  await user.type(
    document.getElementById('individualPassword') as HTMLInputElement,
    'Secure1pass'
  );
  await user.type(
    document.getElementById('individualConfirmPassword') as HTMLInputElement,
    'Secure1pass'
  );
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: /^continue$/i }));
}

export async function completeIndividualOtpStep(
  user: ReturnType<typeof userEvent.setup>
) {
  const digits = screen.getAllByLabelText(/digit \d+ of 6/i);
  for (let i = 0; i < 6; i++) {
    await user.type(digits[i], String(i + 1));
  }
  await user.click(screen.getByRole('button', { name: /verify & finish/i }));
}
