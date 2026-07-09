import type { ParsedFiscalQr } from '@/shared/lib/parse-fiscal-qr';
import { parseFiscalQr } from '@/shared/lib/parse-fiscal-qr';
import { notification } from '@/shared/notification';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

interface QrScannerModalProps {
	opened: boolean;
	onClose: () => void;
	onParsed: (data: ParsedFiscalQr) => void;
}

export function QrScannerModal({
	opened,
	onClose,
	onParsed,
}: QrScannerModalProps) {
	const [manualInput, setManualInput] = useState('');
	const [paused, setPaused] = useState(false);

	function applyParsed(raw: string) {
		const parsed = parseFiscalQr(raw);
		if (!parsed.fn && !parsed.fpd && !parsed.fp && !parsed.fd && !parsed.amount) {
			notification.error('Ошибка', 'Не удалось распознать фискальный QR');
			return;
		}

		onParsed(parsed);
		onClose();
		setManualInput('');
		setPaused(false);
	}

	function handleScan(detectedCodes: Array<{ rawValue: string }>) {
		const raw = detectedCodes[0]?.rawValue;
		if (!raw || paused) {
			return;
		}

		setPaused(true);
		applyParsed(raw);
	}

	function handleManualSubmit() {
		applyParsed(manualInput);
	}

	function handleClose() {
		setManualInput('');
		setPaused(false);
		onClose();
	}

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title="Сканирование QR чека"
			size="lg"
		>
			<Stack>
				{opened && !paused && (
					<Scanner
						onScan={handleScan}
						onError={(error) => {
							const message =
								error instanceof Error
									? error.message
									: 'Не удалось получить доступ к камере';
							notification.error('Камера', message);
						}}
						constraints={{ facingMode: 'environment' }}
						styles={{ container: { width: '100%', minHeight: 240 } }}
					/>
				)}
				<TextInput
					label="Ручной ввод QR"
					placeholder="t=...&s=...&fn=...&fp=...&i=..."
					value={manualInput}
					onChange={(event) => setManualInput(event.currentTarget.value)}
				/>
				<Group justify="flex-end">
					<Button variant="default" onClick={handleClose}>
						Отмена
					</Button>
					<Button onClick={handleManualSubmit} disabled={!manualInput.trim()}>
						Применить
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}
