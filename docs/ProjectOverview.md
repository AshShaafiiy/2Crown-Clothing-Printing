# Project Overview

## What is 2Crown Clothing & Printing?
2Crown Clothing & Printing is a custom clothing, printing, and branding business operating in Nigeria. The brand positions itself as a premium service, utilizing a distinct Black, Gold, and White visual identity. 

## Platform Purpose
This repository houses the frontend platform designed to modernize 2Crown's customer interactions. The platform serves as an e-commerce storefront, a custom order inquiry portal, and a business management dashboard. The ultimate goal is to provide a seamless, premium web experience while offloading heavy file interactions (custom designs, reference images) directly to the business's WhatsApp channel.

## Target Infrastructure
A critical requirement for this project is a **Zero-Cost ($0/month)** infrastructure architecture (excluding the custom domain). The platform must be designed to eventually deploy on free-tier services (e.g., GitHub Pages, Cloudflare Pages) and utilize serverless/free-tier backend solutions.

## Customer-Facing Functionality
- **Storefront (Shop)**: Customers can browse normal, predefined products, select variations (size, color, text customizations), and add them to a shopping cart.
- **Custom Work Requests**: A dedicated "Need Something Custom?" section guides users who need entirely bespoke designs or bulk orders to contact the business directly via WhatsApp.
- **Checkout & WhatsApp Ordering**: The final cart checkout generates a detailed order payload that is securely formatted and pre-filled into a WhatsApp message sent directly to 2Crown.
- **Order Tracking**: Customers can check the status of an existing order using their reference number.
- **Product Ratings**: Customers can submit 1-5 star ratings for products. (Written reviews are intentionally excluded).

## Admin Functionality
- **Dashboard**: High-level metrics on orders, revenue, and active customers.
- **Order Management**: Viewing customer orders, delivery methods, and custom requirements.
- **Product & Category Management**: Creating and updating storefront items, variations, and active statuses.
- **Gallery & Content Management**: Managing images for the "Our Work" gallery.
- **Business Settings**: Centralized control over the business WhatsApp number, contact information, and operating hours.
