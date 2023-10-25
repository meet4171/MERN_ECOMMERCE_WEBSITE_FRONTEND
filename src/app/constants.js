export const ITEMS_PER_PAGE = 9;
export function selectStatusColor(status) {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-300 text-black'
        case 'Dispached':
            return 'bg-blue-500 text-white'
        case 'Out for Delivery':
            return 'bg-orange-300 text-black'
        case 'Delivered':
            return 'bg-green-500 text-white'
        case 'Cancelled':
            return 'bg-red-500 text-white'
        default:
            return 'bg-white text-black'
    }

}
