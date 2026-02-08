"use client";

type PersonalInfoProps = {
  student: {
    name: string;
    address: string;
    admissionDate: string;
    gender: string;
    class_name: string;
    batch_name: string;
    parentInfo?: {
      fatherName: string;
      motherName: string;
      parentPhone: string;
      parentEmail: string;
    };
  };
};

export default function PersonalInfo({ student }: PersonalInfoProps) {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h2 className="text-xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
        Personal Information
      </h2>

      {/* --- Student Details --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow-sm">
        <div>
          <p className="font-semibold">Class</p>
          <p>{student.class_name}</p>
        </div>
        <div>
          <p className="font-semibold">Batch</p>
          <p>{student.batch_name}</p>
        </div>
        <div>
          <p className="font-semibold">Name</p>
          <p>{student.name}</p>
        </div>
        <div>
          <p className="font-semibold">Address</p>
          <p>{student.address}</p>
        </div>
        <div>
          <p className="font-semibold">Admission Date</p>
          <p>{new Date(student.admissionDate).toDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Gender</p>
          <p>{student.gender}</p>
        </div>
      </div>

      {/* --- Parent Information --- */}
      {student.parentInfo && (
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
            Parent Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-semibold">Father's Name</p>
              <p>{student.parentInfo.fatherName}</p>
            </div>
            <div>
              <p className="font-semibold">Mother's Name</p>
              <p>{student.parentInfo.motherName}</p>
            </div>
            <div>
              <p className="font-semibold">Parent Phone</p>
              <p>{student.parentInfo.parentPhone}</p>
            </div>
            <div>
              <p className="font-semibold">Parent Email</p>
              <p>{student.parentInfo.parentEmail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
