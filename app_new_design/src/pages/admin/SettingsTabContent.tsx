interface SettingsTabContentProps {
  systemSettings: any[];
  governorates: any[];
  newGovName: string;
  onNewGovNameChange: (name: string) => void;
  onAddGovernorate: () => void;
  onToggleGovStatus: (id: string, currentState: boolean, name: string) => void;
  onDeleteGov: (id: string, name: string) => void;
  onUpdateSetting: (key: string, value: any, desc: string) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function SettingsTabContent({
  systemSettings,
  governorates,
  newGovName,
  onNewGovNameChange,
  onAddGovernorate,
  onToggleGovStatus,
  onDeleteGov,
  onUpdateSetting,
  onAddLog
}: SettingsTabContentProps) {
  return (
    <div className="space-y-lg">
      {/* Platform Settings */}
      <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
        <div className="p-md border-b border-border-light">
          <h2 className="font-headline-sm text-headline-sm">إعدادات المنصة</h2>
        </div>
        <div className="p-md space-y-md">
          {systemSettings.map(setting => (
            <div key={setting.id} className="flex flex-col gap-2 p-sm bg-surface-container-low rounded-lg">
              <div className="flex justify-between items-center">
                <label className="font-label-lg font-bold">{setting.description}</label>
                {setting.value === 'true' || setting.value === 'false' ? (
                  <input
                    type="checkbox"
                    checked={setting.value === 'true'}
                    onChange={(e) => onUpdateSetting(setting.key, e.target.checked.toString(), setting.description)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => onUpdateSetting(setting.key, e.target.value, setting.description)}
                    className="px-3 py-1 rounded border border-border-light text-body-sm w-1/3"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governorates Management */}
      <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
        <div className="p-md border-b border-border-light">
          <h2 className="font-headline-sm text-headline-sm">إدارة المحافظات</h2>
        </div>
        <div className="p-md space-y-md">
          <div className="flex gap-md">
            <input
              type="text"
              placeholder="أضف محافظة جديدة"
              value={newGovName}
              onChange={(e) => onNewGovNameChange(e.target.value)}
              className="flex-grow px-md py-sm rounded border border-border-light text-body-sm"
            />
            <button
              onClick={onAddGovernorate}
              className="bg-primary text-white px-md py-sm rounded hover:bg-primary/90 transition-colors font-bold text-sm"
            >
              إضافة
            </button>
          </div>

          <div className="space-y-2">
            {governorates.map(gov => (
              <div key={gov.id} className="flex justify-between items-center p-sm bg-surface-container-low rounded-lg">
                <span className="font-label-lg">{gov.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleGovStatus(gov.id, gov.is_active, gov.name)}
                    className="p-1 text-tertiary hover:text-primary transition-colors"
                    title={gov.is_active ? 'تعطيل' : 'تفعيل'}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {gov.is_active ? 'check_circle' : 'block'}
                    </span>
                  </button>
                  <button
                    onClick={() => onDeleteGov(gov.id, gov.name)}
                    className="p-1 text-tertiary hover:text-error transition-colors"
                    title="حذف"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
