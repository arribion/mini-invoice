import React, { useState } from 'react'
import ResourceTable from '../../components/admin/ResourceTable';
import ResourcesUploadForm from '../../components/admin/ResourceUploadForm';

const ManageResources = () => {
  const [showResourceForm, setShowResourceForm] = useState<boolean>(false);

  const handleResourceForm = () => {
    setShowResourceForm(!showResourceForm);
  }

  return (
    <div className="m-4">
      <section className="flex mb-6">
        <div>
          <h1>Resources</h1>
          <p>PDF, DOCX, VIDEOS, AUDIO, (ZIP)</p>
        </div>
        <div>
          <button
            onClick={handleResourceForm}
            className="border hover:bg-gray-100">Upload Resources</button>
        </div>
      </section>
      <section>
          {showResourceForm && <ResourcesUploadForm />}
        <ResourceTable />
      </section>
    </div>
  );
}

export default ManageResources