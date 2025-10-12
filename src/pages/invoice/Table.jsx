import { capitalizeFirstLetter, formatDate } from "../../utils/utils";

const Table = ({ invoiceData }) => {
	let paid = 0;
	let payable = 0;
	if (invoiceData) {
		paid = invoiceData.payments
			.reduce((sum, item) => sum + item.paid, 0)
			.toFixed(2);
		payable =
			invoiceData.payments[invoiceData.payments.length - 1].payable.toFixed(2);
	}
	return (
		<>
			<div className="mt-8 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg overflow-auto">
				<table className="min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
								Membership Name
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								Start Date
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								End Date
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								Package Price
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								Discount
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								Paid
							</th>
							<th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
								Payable
							</th>
						</tr>
					</thead>
					<tbody>
						{!invoiceData
							? // Render skeleton rows while loading
							  Array.from({ length: 5 }).map((_, index) => (
									<tr key={index} className="odd:bg-white even:bg-gray-50">
										<td className="py-4 pl-4 pr-3 text-sm text-gray-600 sm:pl-6 font-bold">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-32 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											<span className="animate-pulse bg-gray-300 rounded-md h-4 w-24 inline-block"></span>
										</td>
									</tr>
							  ))
							: // Render actual membership details
							  invoiceData.payments.map((payment, index) => (
									<tr key={index} className="odd:bg-white even:bg-gray-50">
										{index === 0 ? (
											<>
												{" "}
												<td className="py-4 pl-4 pr-3 text-sm text-gray-600 sm:pl-6 font-bold">
													{capitalizeFirstLetter(invoiceData.membershipName)}
												</td>
												<td className="px-3 py-4 text-sm text-right text-gray-500">
													{formatDate(invoiceData.startDate)}
												</td>
												<td className="px-3 py-4 text-sm text-right text-gray-500">
													{formatDate(invoiceData.endDate)}
												</td>
												<td className="px-3 py-4 text-sm text-right text-gray-500">
													₹{invoiceData.planPrice.toFixed(2)}
												</td>
												<td className="px-3 py-4 text-sm text-right text-gray-500">
													₹{invoiceData.discount.toFixed(2)}
												</td>
											</>
										) : (
											<>
												<td className="py-4 pl-4 pr-3 text-sm text-gray-600 sm:pl-6 font-bold"></td>
												<td className="px-3 py-4 text-sm text-right text-gray-500"></td>
												<td className="px-3 py-4 text-sm text-right text-gray-500"></td>
												<td className="px-3 py-4 text-sm text-right text-gray-500"></td>
												<td className="px-3 py-4 text-sm text-right text-gray-500"></td>
											</>
										)}

										<td className="px-3 py-4 text-sm text-right text-gray-500">
											₹{payment.paid.toFixed(2)}
										</td>
										<td className="px-3 py-4 text-sm text-right text-gray-500">
											₹{payment.payable.toFixed(2)}
										</td>
									</tr>
							  ))}
						<tr className="even:bg-gray-50">
							<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"></td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"></td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"></td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"></td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"></td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-700 sm:pl-6 font-bold text-right">
								₹{paid}
							</td>
							<td className="py-4 pl-4 pr-3 text-sm text-gray-700 sm:pl-6 font-bold text-right">
								₹{payable}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
};
export default Table;
