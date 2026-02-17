//Generate code for Capital call breakdown section Table with editable rows, add/remove rows, and percentage validation in React using TypeScript and react-hook-form and make sure it is responsive and mobile-friendly and follows best practices for accessibility and user experience as well strictly follow the frontend-spec.md guidelines for styling and component structure.
import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';

//import { useForm, useFieldArray, Controller } from 'react-hook-form';

import  Table from '../../../components/ui/Table';
interface BreakdownFormValues {
    breakdowns: {
        id: string;
        name: string;
        percentage: number;
    }[];
}
interface BreakdownSectionProps {
    control: any;
    errors: any;
}
const BreakdownSection: React.FC<BreakdownSectionProps> = ({
    control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'breakdowns',
    });
    return (
        <div className="card bg-white shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Breakdown</h2>
                <button type="button" onClick={() => append({ id: Date.now().toString(), name: '', percentage: 0 })} className="btn btn-sm btn-primary" >
                    Add Breakdown
                </button>
            </div>
            <Table columns={[
                {
                    header: 'Name',
                    accessor: 'name'
                }, {
                    header: 'Percentage',
                    accessor: 'percentage'
                }, {
                    header: 'Actions',
                    accessor: 'actions'
                },
            ]}
                data={
                    fields.map((field, index) => ({
                        name: (
                            <Controller control={control} name={`breakdowns.${index}.name`}
                                render={({ field }) => (
                                    <input type="text" className="form-input" {...field} />
                                )}
                            />
                        ),
                        percentage: (
                            <Controller control={control} name={`breakdowns.${index}.percentage`}
                                rules={{
                                    required: 'Percentage is required', min: { value: 0, message: 'Percentage must be at least 0' }, max: { value: 100, message: 'Percentage cannot exceed 100' },
                                }}
                                render={({ field }) => (
                                    <input type="number" className="form-input" {...field} />)}
                            />
                        ),
                        actions: (
                            <button type="button" onClick={() => remove(index)} className="btn btn-sm btn-danger" >
                                Remove
                            </button>
                        ),
                    }))}
            />
            {
                errors?.breakdowns && (
                    <p className="form-error mt-2">{errors.breakdowns.message}</p>
                )}
        </div>
    );
}
export default BreakdownSection; 
