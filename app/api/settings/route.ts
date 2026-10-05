import { NextResponse } from 'next/server';
import { settingsRepository } from '@/backend/repositories';
import { BusinessSettingsInputSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';

export async function GET(req: Request) {
  const settings = await settingsRepository.getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { data, error, status } = await parseBody(req, BusinessSettingsInputSchema);
  if (error) return NextResponse.json(error, { status });

  const currentSettings = await settingsRepository.getSettings();
  const updatedSettings = await settingsRepository.updateSettings(currentSettings.id, data!);
  return NextResponse.json(updatedSettings);
}
