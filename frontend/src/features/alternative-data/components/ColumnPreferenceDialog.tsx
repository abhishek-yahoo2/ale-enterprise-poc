import React, {useState} from 'react';
//import all dependencies


interface ColumnPreferenceDialogProps {
  open: boolean;
  onClose: () => void;
  currentPreference?: ColumnPreference;
}

export const ColumnPreferenceDialog: React.FC<ColumnPreferenceDialogProps> = ({
  open,
  onClose,
  currentPreference
}) => {
  const [viewName, setViewName] = useState(currentPreference?.viewName || '');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    currentPreference?.columns || []
  );

  const { mutate: savePreference } = useSaveColumnPreference();

  const availableColumns = AVAILABLE_COLUMNS.filter(
    col => !selectedColumns.includes(col.key)
  );

  const handleAddColumn = (columnKey: string) => {
    if (selectedColumns.length >= 40) {
      toast.error('Maximum 40 columns allowed');
      return;
    }
    setSelectedColumns([...selectedColumns, columnKey]);
  };

  const handleRemoveColumn = (columnKey: string) => {
    setSelectedColumns(selectedColumns.filter(k => k !== columnKey));
  };

  const handleSave = () => {
    if (!viewName.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    savePreference({
      viewName,
      columns: selectedColumns,
      moduleName: 'ALTERNATIVE_DATA'
    }, {
      onSuccess: () => {
        toast.success('Column preference saved');
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Column Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label="View Name"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="My Custom View"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Available Columns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Columns</CardTitle>
              </CardHeader>
              <CardContent className="h-96 overflow-y-auto">
                <div className="space-y-2">
                  {availableColumns.map(col => (
                    <div
                      key={col.key}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <span className="text-sm">{col.label}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddColumn(col.key)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Columns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Selected Columns ({selectedColumns.length}/40)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96 overflow-y-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="selected-columns">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {selectedColumns.map((colKey, index) => {
                          const col = AVAILABLE_COLUMNS.find(c => c.key === colKey);
                          return (
                            <Draggable key={colKey} draggableId={colKey} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex justify-between items-center p-2 mb-2 bg-blue-50 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{col?.label}</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveColumn(colKey)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};