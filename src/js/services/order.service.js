/**
 * @fileoverview Order Service for Shoppio
 * @description Handles order creation, management, and history
 * @version 1.0.0
 */

'use strict';

/**
 * Order Service
 * @namespace OrderService
 */
const OrderService = {
    /**
     * Create new order
     * @param {Object} orderData - Order details
     * @returns {Object} Created order
     */
    createOrder(orderData) {
        const order = {
            id: generateOrderId(),
            date: new Date().toISOString(),
            status: ORDER_STATUS.CONFIRMED,
            userId: AuthService.currentUser?.id || 'guest',
            ...orderData
        };
        
        // Save to localStorage
        const orders = this.getOrders();
        orders.push(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        // Store for confirmation page
        localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(order));
        
        return order;
    },
    
    /**
     * Get all orders for current user
     * @returns {Array} User orders
     */
    getOrders() {
        try {
            const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
            const userOrders = orders ? JSON.parse(orders) : [];
            
            // Combine with sample orders for demo
            const allOrders = [...sampleOrders, ...userOrders];
            
            // Filter by current user if logged in
            if (AuthService.isLoggedIn()) {
                return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            
            return [];
        } catch (error) {
            console.error('Error getting orders:', error);
            return [];
        }
    },
    
    /**
     * Get order by ID
     * @param {string} orderId - Order ID
     * @returns {Object|null} Order or null
     */
    getOrderById(orderId) {
        const orders = this.getOrders();
        return orders.find(o => o.id === orderId) || null;
    },
    
    /**
     * Get last placed order
     * @returns {Object|null} Last order or null
     */
    getLastOrder() {
        try {
            const order = localStorage.getItem(STORAGE_KEYS.LAST_ORDER);
            return order ? JSON.parse(order) : null;
        } catch (error) {
            console.error('Error getting last order:', error);
            return null;
        }
    },
    
    /**
     * Clear last order from storage
     */
    clearLastOrder() {
        localStorage.removeItem(STORAGE_KEYS.LAST_ORDER);
    },
    
    /**
     * Get order status display text
     * @param {string} status - Order status
     * @returns {Object} Status text and color
     */
    getStatusDisplay(status) {
        const statusMap = {
            [ORDER_STATUS.PENDING]: { text: 'Pending', color: 'warning', icon: 'clock' },
            [ORDER_STATUS.CONFIRMED]: { text: 'Confirmed', color: 'info', icon: 'check-circle' },
            [ORDER_STATUS.PROCESSING]: { text: 'Processing', color: 'info', icon: 'cog' },
            [ORDER_STATUS.SHIPPED]: { text: 'Shipped', color: 'primary', icon: 'truck' },
            [ORDER_STATUS.OUT_FOR_DELIVERY]: { text: 'Out for Delivery', color: 'primary', icon: 'shipping-fast' },
            [ORDER_STATUS.DELIVERED]: { text: 'Delivered', color: 'success', icon: 'check-double' },
            [ORDER_STATUS.CANCELLED]: { text: 'Cancelled', color: 'error', icon: 'times-circle' },
            [ORDER_STATUS.RETURNED]: { text: 'Returned', color: 'warning', icon: 'undo' }
        };
        
        return statusMap[status] || { text: status, color: 'default', icon: 'question' };
    },
    
    /**
     * Cancel order
     * @param {string} orderId - Order ID
     * @returns {Object} Result
     */
    cancelOrder(orderId) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index === -1) {
            return { success: false, error: 'Order not found' };
        }
        
        const order = orders[index];
        
        // Can only cancel pending or confirmed orders
        if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)) {
            return { success: false, error: 'Order cannot be cancelled' };
        }
        
        orders[index].status = ORDER_STATUS.CANCELLED;
        orders[index].cancelledAt = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        return { success: true };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderService;
}
