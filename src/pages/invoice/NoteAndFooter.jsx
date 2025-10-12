const NoteAndFooter = () => {
  return (
    <>
      {/* Notes Section */}
      <div className="mt-8 bg-gray-100 p-4 border border-gray-300 rounded-md text-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Terms & conditions</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Any extensions are not applicable on any package.</li>
          <li>Fees once paid cannot be refunded.</li>
          <li>
            Facilities are recommended for alternate day use and are to be
            strictly utilized as per the specification of the trainer.
          </li>
        </ul>
      </div>

      {/* Footer with Thank You message and Coach Name */}
      <footer className="mt-10 flex justify-between items-center text-gray-500 text-sm">
        <div>
          <p>
            Thank you for being a valued member of{' '}
            <span className="font-bold">Our Gym!</span>
          </p>
        </div>
      </footer>
    </>
  );
};
export default NoteAndFooter;
