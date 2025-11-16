import { Dialog } from '@headlessui/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <ExclamationCircleOutlined className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
              Xác nhận xóa
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa <span className="font-medium text-gray-900">"{itemName}"</span>? 
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
              onClick={onConfirm}
            >
              Xóa
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
