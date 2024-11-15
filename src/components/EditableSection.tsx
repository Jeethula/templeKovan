// components/EditableSection.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, X, Check } from 'lucide-react';

interface EditableSectionProps {
  section: string;
  fields: string[];
  profile: {
    [key: string]: string | undefined;
  };
  onSave: (section: string, values: { [key: string]: string }) => Promise<void>;
}

const formatFieldLabel = (field: string) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const EditableSection: React.FC<EditableSectionProps> = ({
  section,
  fields,
  profile,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<{ [key: string]: string }>({});

  const handleEdit = () => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field] = profile[field] || '';
      return acc;
    }, {} as { [key: string]: string });
    
    setValues(initialValues);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValues({});
  };

  const handleSave = async () => {
    await onSave(section, values);
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#663399]">
          {section === 'personalInfo' ? 'Personal Information' : 'Address Information'}
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-[#663399]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {formatFieldLabel(field)}
            </label>
            {isEditing ? (
              <Input
                value={values[field] || ''}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="w-full"
              />
            ) : (
              <p className="text-gray-600">{profile[field] || '-'}</p>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-1 bg-[#663399] hover:bg-[#663399]/90"
          >
            <Check className="h-4 w-4" />
            Save
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EditableSection;