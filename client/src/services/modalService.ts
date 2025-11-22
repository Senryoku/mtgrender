import { createApp } from 'vue';
import Modal from '../components/Modal.vue';

export interface ModalInstance {
	$refs: {
		defaultSlot: HTMLElement;
	};
	set_disposable: (disposable: boolean) => void;
	close?: () => void;
}

export interface ModalOptions {
	disposable?: boolean;
	confirmable?: boolean;
	confirmText?: string;
	onConfirm?: () => void;
}

export const modalService = {
	open(options: ModalOptions = {}): ModalInstance {
		const div = document.createElement('div');
		document.body.appendChild(div);
		return createApp(Modal, options).mount(div) as ModalInstance;
	},
};
