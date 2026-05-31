import { useState } from 'react';
import {
  updateListingStatus,
  deleteListing,
  updateServiceStatus,
  deleteService,
  approveTransaction,
  toggleUserAdmin,
  toggleUserBan,
  approveWorkshop,
  rejectWorkshop,
  addGovernorate,
  toggleGovernorate,
  deleteGovernorate,
  updateSystemSetting,
  insertAdminLog,
} from '../../lib/queries/index';

export function useAdminHandlers(userName: string) {
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  const addLog = async (action: string, type: string, color: string, icon: string) => {
    const newLog = {
      action,
      type,
      color,
      icon
    };

    setActivityLogs(prev => [{
      id: Date.now(),
      ...newLog,
      users: { name: userName || 'Admin' },
      created_at: new Date().toISOString()
    }, ...prev]);

    await insertAdminLog(newLog);
  };

  const handleToggleListing = async (id: string, currentStatus: string, onSuccess: (id: string, status: string) => void) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateListingStatus(id, newStatus);
      onSuccess(id, newStatus);
      addLog(`تغيير حالة إعلان إلى ${newStatus === 'active' ? 'مفعل' : 'معطل'}`, 'edit', 'blue', 'toggle_on');
    } catch (error) {
      console.error('Error toggling listing:', error);
      alert('حدث خطأ أثناء تحديث حالة الإعلان');
    }
  };

  const handleDeleteListing = async (id: string, onSuccess: (id: string) => void) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) return;
    try {
      await deleteListing(id);
      onSuccess(id);
      addLog('حذف إعلان', 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
    }
  };

  const handleToggleService = async (id: string, currentStatus: string, onSuccess: (id: string, status: string) => void) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateServiceStatus(id, newStatus);
      onSuccess(id, newStatus);
      addLog(`تغيير حالة ورشة إلى ${newStatus === 'active' ? 'مفعلة' : 'معطلة'}`, 'edit', 'blue', 'toggle_on');
    } catch (error) {
      console.error('Error toggling service:', error);
      alert('حدث خطأ أثناء تحديث حالة الورشة');
    }
  };

  const handleDeleteService = async (id: string, onSuccess: (id: string) => void) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الورشة نهائياً؟')) return;
    try {
      await deleteService(id);
      onSuccess(id);
      addLog('حذف خدمة/ورشة', 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('حدث خطأ أثناء حذف الورشة');
    }
  };

  const handleApproveTransaction = async (txId: string, userId: string, amount: number, onSuccess: (txId: string) => void) => {
    try {
      await approveTransaction(txId, userId, amount);
      onSuccess(txId);
      addLog(`قبول شحن محفظة: ${amount} ل.س`, 'add', 'green', 'check_circle');
    } catch (error) {
      alert('حدث خطأ أثناء قبول الشحن');
    }
  };

  const handleToggleUserAdmin = async (userId: string, currentIsAdmin: boolean, onSuccess: (userId: string, isAdmin: boolean) => void) => {
    try {
      const updated = await toggleUserAdmin(userId, !currentIsAdmin);
      onSuccess(userId, updated.is_admin);
      addLog(`${!currentIsAdmin ? 'منح' : 'سحب'} صلاحية الإدارة`, 'edit', 'blue', 'admin_panel_settings');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الصلاحيات');
    }
  };

  const handleToggleUserBan = async (userId: string, currentIsBanned: boolean, onSuccess: (userId: string, isBanned: boolean) => void) => {
    const msg = currentIsBanned ? 'هل تريد رفع الحظر عن هذا المستخدم؟' : 'هل تريد حظر هذا المستخدم؟';
    if (!window.confirm(msg)) return;
    try {
      const updated = await toggleUserBan(userId, !currentIsBanned);
      onSuccess(userId, updated.is_banned);
      addLog(`${!currentIsBanned ? 'حظر' : 'رفع حظر'} مستخدم`, 'edit', !currentIsBanned ? 'red' : 'green', 'block');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث حالة المستخدم');
    }
  };

  const handleApproveWorkshop = async (id: string, onSuccess: (id: string) => void) => {
    try {
      await approveWorkshop(id);
      onSuccess(id);
      addLog('قبول طلب تسجيل ورشة', 'add', 'green', 'handyman');
    } catch (error) {
      alert('حدث خطأ أثناء قبول الورشة');
    }
  };

  const handleRejectWorkshop = async (id: string, onSuccess: (id: string) => void) => {
    if (!window.confirm('هل أنت متأكد من رفض طلب الورشة؟')) return;
    try {
      await rejectWorkshop(id);
      onSuccess(id);
      addLog('رفض طلب تسجيل ورشة', 'delete', 'red', 'cancel');
    } catch (error) {
      alert('حدث خطأ أثناء رفض الورشة');
    }
  };

  const handleAddGovernorate = async (name: string, onSuccess: (name: string) => void) => {
    try {
      const result = await addGovernorate(name);
      onSuccess(name);
      addLog(`إضافة محافظة: ${name}`, 'add', 'green', 'map');
    } catch (error) {
      alert('حدث خطأ أثناء إضافة المحافظة');
    }
  };

  const handleToggleGovStatus = async (govId: string, currentStatus: boolean, govName: string, onSuccess: (govId: string, status: boolean) => void) => {
    try {
      const result = await toggleGovernorate(govId, !currentStatus);
      onSuccess(govId, result.is_active);
      addLog(`${!currentStatus ? 'تفعيل' : 'تعطيل'} محافظة: ${govName}`, 'edit', 'blue', 'map');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث حالة المحافظة');
    }
  };

  const handleDeleteGovernorate = async (govId: string, govName: string, onSuccess: (govId: string) => void) => {
    if (!window.confirm(`هل تريد حذف محافظة ${govName}؟`)) return;
    try {
      await deleteGovernorate(govId);
      onSuccess(govId);
      addLog(`حذف محافظة: ${govName}`, 'delete', 'red', 'delete');
    } catch (error) {
      alert('حدث خطأ أثناء حذف المحافظة');
    }
  };

  const handleUpdateSetting = async (key: string, value: string, description: string, onSuccess: (key: string, value: string) => void) => {
    try {
      await updateSystemSetting(key, value);
      onSuccess(key, value);
      addLog(`تحديث إعداد: ${description}`, 'edit', 'blue', 'settings');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الإعداد');
    }
  };

  return {
    activityLogs,
    setActivityLogs,
    addLog,
    handleToggleListing,
    handleDeleteListing,
    handleToggleService,
    handleDeleteService,
    handleApproveTransaction,
    handleToggleUserAdmin,
    handleToggleUserBan,
    handleApproveWorkshop,
    handleRejectWorkshop,
    handleAddGovernorate,
    handleToggleGovStatus,
    handleDeleteGovernorate,
    handleUpdateSetting,
  };
}
