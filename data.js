// Blood Bank Management System - Dummy Data Source

const BloodBankData = {
    // 8 Blood Groups Inventory
    stock: [
        { group: "A+", units: 48, capacity: 100, lastUpdated: "2026-07-24 10:30 AM", status: "Optimal" },
        { group: "A-", units: 12, capacity: 60, lastUpdated: "2026-07-24 09:15 AM", status: "Low Stock" },
        { group: "B+", units: 64, capacity: 120, lastUpdated: "2026-07-24 11:00 AM", status: "Optimal" },
        { group: "B-", units: 18, capacity: 60, lastUpdated: "2026-07-23 04:45 PM", status: "Moderate" },
        { group: "AB+", units: 32, capacity: 80, lastUpdated: "2026-07-24 08:20 AM", status: "Optimal" },
        { group: "AB-", units: 8, capacity: 50, lastUpdated: "2026-07-24 07:10 AM", status: "Critical Low" },
        { group: "O+", units: 95, capacity: 150, lastUpdated: "2026-07-24 11:30 AM", status: "Optimal" },
        { group: "O-", units: 14, capacity: 70, lastUpdated: "2026-07-24 09:50 AM", status: "Low Stock" }
    ],

    // Donors List
    donors: [
        {
            id: "DNR-8401",
            name: "Dr. Alexander Wright",
            photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
            age: 34,
            gender: "Male",
            bloodGroup: "O+",
            phone: "+1 (555) 234-8901",
            email: "alexander.wright@healthmed.org",
            address: "452 Medical Parkway, Suite 300",
            city: "New York",
            lastDonationDate: "2026-04-12",
            eligibility: "Eligible",
            totalDonations: 8
        },
        {
            id: "DNR-8402",
            name: "Elena Rostova",
            photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            age: 28,
            gender: "Female",
            bloodGroup: "A-",
            phone: "+1 (555) 456-1122",
            email: "elena.r@vitalcare.io",
            address: "789 Horizon Blvd, Apt 4B",
            city: "Chicago",
            lastDonationDate: "2026-06-30",
            eligibility: "Resting",
            totalDonations: 4
        },
        {
            id: "DNR-8403",
            name: "Marcus Sterling",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            age: 41,
            gender: "Male",
            bloodGroup: "B+",
            phone: "+1 (555) 789-3344",
            email: "marcus.sterling@techcorp.com",
            address: "120 Oak Street",
            city: "San Francisco",
            lastDonationDate: "2026-02-18",
            eligibility: "Eligible",
            totalDonations: 12
        },
        {
            id: "DNR-8404",
            name: "Sarah Jenkins",
            photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
            age: 25,
            gender: "Female",
            bloodGroup: "AB-",
            phone: "+1 (555) 321-9988",
            email: "sarah.j@designstudio.co",
            address: "34 Pinewood Lane",
            city: "Boston",
            lastDonationDate: "2026-07-02",
            eligibility: "Resting",
            totalDonations: 3
        },
        {
            id: "DNR-8405",
            name: "David Chen",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            age: 38,
            gender: "Male",
            bloodGroup: "O-",
            phone: "+1 (555) 654-7711",
            email: "d.chen@apexglobal.net",
            address: "901 Sunset Blvd",
            city: "Los Angeles",
            lastDonationDate: "2025-11-14",
            eligibility: "Ineligible",
            totalDonations: 15
        },
        {
            id: "DNR-8406",
            name: "Priya Sharma",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            age: 30,
            gender: "Female",
            bloodGroup: "A+",
            phone: "+1 (555) 987-2233",
            email: "priya.sharma@innovate.org",
            address: "555 Cedar Heights",
            city: "Seattle",
            lastDonationDate: "2026-03-22",
            eligibility: "Eligible",
            totalDonations: 6
        },
        {
            id: "DNR-8407",
            name: "Robert Vance",
            photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
            age: 49,
            gender: "Male",
            bloodGroup: "AB+",
            phone: "+1 (555) 112-4455",
            email: "rvance@vancerefrigeration.com",
            address: "88 Industrial Way",
            city: "Chicago",
            lastDonationDate: "2026-01-10",
            eligibility: "Eligible",
            totalDonations: 20
        },
        {
            id: "DNR-8408",
            name: "Sophia Martinez",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
            age: 27,
            gender: "Female",
            bloodGroup: "B-",
            phone: "+1 (555) 887-6611",
            email: "sophia.m@biohealth.org",
            address: "210 Magnolia Ave",
            city: "Miami",
            lastDonationDate: "2026-05-05",
            eligibility: "Eligible",
            totalDonations: 5
        }
    ],

    // Recipients List
    recipients: [
        {
            id: "RCP-3091",
            name: "Jonathan Myers",
            age: 52,
            gender: "Male",
            bloodGroupNeeded: "O-",
            hospital: "St. Jude Memorial Hospital",
            doctor: "Dr. Catherine Hayes",
            unitsRequired: 3,
            priority: "Emergency",
            status: "Pending",
            dateRegistered: "2026-07-24"
        },
        {
            id: "RCP-3092",
            name: "Amelia Thorne",
            age: 29,
            gender: "Female",
            bloodGroupNeeded: "A+",
            hospital: "Metropolitan General Hospital",
            doctor: "Dr. Richard Branson",
            unitsRequired: 2,
            priority: "High",
            status: "Processing",
            dateRegistered: "2026-07-24"
        },
        {
            id: "RCP-3093",
            name: "Ethan Ramirez",
            age: 19,
            gender: "Male",
            bloodGroupNeeded: "B+",
            hospital: "Children's Trauma Center",
            doctor: "Dr. Samuel Jackson",
            unitsRequired: 1,
            priority: "Normal",
            status: "Fulfilled",
            dateRegistered: "2026-07-23"
        },
        {
            id: "RCP-3094",
            name: "Grace Montgomery",
            age: 63,
            gender: "Female",
            bloodGroupNeeded: "AB-",
            hospital: "City Cardiac Institute",
            doctor: "Dr. Elizabeth Vance",
            unitsRequired: 2,
            priority: "Emergency",
            status: "Pending",
            dateRegistered: "2026-07-24"
        },
        {
            id: "RCP-3095",
            name: "Lucas Bennett",
            age: 44,
            gender: "Male",
            bloodGroupNeeded: "A-",
            hospital: "St. Jude Memorial Hospital",
            doctor: "Dr. Catherine Hayes",
            unitsRequired: 4,
            priority: "High",
            status: "Processing",
            dateRegistered: "2026-07-22"
        }
    ],

    // Blood Requests List
    requests: [
        {
            id: "REQ-9901",
            recipient: "Jonathan Myers",
            hospital: "St. Jude Memorial Hospital",
            bloodGroup: "O-",
            units: 3,
            priority: "Emergency",
            date: "2026-07-24 10:15 AM",
            status: "Pending",
            notes: "Critical surgery requirement following severe road trauma."
        },
        {
            id: "REQ-9902",
            recipient: "Grace Montgomery",
            hospital: "City Cardiac Institute",
            bloodGroup: "AB-",
            units: 2,
            priority: "Emergency",
            date: "2026-07-24 09:40 AM",
            status: "Pending",
            notes: "Open heart surgery scheduled for 2:00 PM today."
        },
        {
            id: "REQ-9903",
            recipient: "Amelia Thorne",
            hospital: "Metropolitan General Hospital",
            bloodGroup: "A+",
            units: 2,
            priority: "High",
            date: "2026-07-24 08:30 AM",
            status: "Approved",
            notes: "Post-partum hemorrhage management."
        },
        {
            id: "REQ-9904",
            recipient: "Lucas Bennett",
            hospital: "St. Jude Memorial Hospital",
            bloodGroup: "A-",
            units: 4,
            priority: "High",
            date: "2026-07-23 03:20 PM",
            status: "Approved",
            notes: "Oncology transfusion treatment protocol."
        },
        {
            id: "REQ-9905",
            recipient: "Charles Lee",
            hospital: "Valley Health Medical Center",
            bloodGroup: "B-",
            units: 1,
            priority: "Normal",
            date: "2026-07-23 11:10 AM",
            status: "Rejected",
            notes: "Cross-matching discrepancy. Alternative donor assigned."
        },
        {
            id: "REQ-9906",
            recipient: "Nancy Drew",
            hospital: "Mercy General Hospital",
            bloodGroup: "O+",
            units: 5,
            priority: "Emergency",
            date: "2026-07-22 06:45 PM",
            status: "Approved",
            notes: "Multiple organ trauma unit dispatch."
        }
    ],

    // Donation History
    donations: [
        {
            id: "DON-5510",
            donorName: "Dr. Alexander Wright",
            bloodGroup: "O+",
            units: 1,
            date: "2026-07-24 09:00 AM",
            camp: "Main Blood Bank Center",
            hospital: "Central Inventory Reserve",
            status: "Completed"
        },
        {
            id: "DON-5509",
            donorName: "Priya Sharma",
            bloodGroup: "A+",
            units: 1,
            date: "2026-07-23 02:30 PM",
            camp: "Tech Park Corporate Donation Drive",
            hospital: "Metropolitan General Hospital",
            status: "Verified"
        },
        {
            id: "DON-5508",
            donorName: "Robert Vance",
            bloodGroup: "AB+",
            units: 1,
            date: "2026-07-22 11:15 AM",
            camp: "City Hall Community Drive",
            hospital: "City Cardiac Institute",
            status: "Completed"
        },
        {
            id: "DON-5507",
            donorName: "Marcus Sterling",
            bloodGroup: "B+",
            units: 1,
            date: "2026-07-20 10:00 AM",
            camp: "Main Blood Bank Center",
            hospital: "Central Inventory Reserve",
            status: "Completed"
        },
        {
            id: "DON-5506",
            donorName: "Sophia Martinez",
            bloodGroup: "B-",
            units: 1,
            date: "2026-07-18 04:20 PM",
            camp: "University Youth Blood Drive",
            hospital: "Children's Trauma Center",
            status: "Completed"
        }
    ],

    // Registered Hospitals
    hospitals: [
        {
            id: "HSP-101",
            name: "St. Jude Memorial Hospital",
            address: "1200 Healthcare Way, Sector 4",
            phone: "+1 (555) 900-1100",
            email: "bloodbank@stjudehospital.org",
            activeRequests: 4,
            availableBeds: 85,
            totalBeds: 450,
            status: "Active Partner",
            emergencySupport: "24/7 Trauma Level 1"
        },
        {
            id: "HSP-102",
            name: "Metropolitan General Hospital",
            address: "500 Grand Avenue, Downtown",
            phone: "+1 (555) 900-2200",
            email: "supply@metrophospital.com",
            activeRequests: 2,
            availableBeds: 120,
            totalBeds: 600,
            status: "Active Partner",
            emergencySupport: "24/7 Trauma Level 1"
        },
        {
            id: "HSP-103",
            name: "City Cardiac Institute",
            address: "88 Heart Center Blvd",
            phone: "+1 (555) 900-3300",
            email: "t.unit@citycardiac.org",
            activeRequests: 3,
            availableBeds: 42,
            totalBeds: 200,
            status: "Active Partner",
            emergencySupport: "Specialty Surgical"
        },
        {
            id: "HSP-104",
            name: "Children's Trauma & Care Hospital",
            address: "33 Pediatrics Lane",
            phone: "+1 (555) 900-4400",
            email: "er@childrentrauma.org",
            activeRequests: 1,
            availableBeds: 60,
            totalBeds: 250,
            status: "Active Partner",
            emergencySupport: "Pediatric Emergency"
        },
        {
            id: "HSP-105",
            name: "Valley Health Medical Center",
            address: "740 Valley Highway",
            phone: "+1 (555) 900-5500",
            email: "desk@valleyhealth.net",
            activeRequests: 0,
            availableBeds: 15,
            totalBeds: 180,
            status: "On Call",
            emergencySupport: "Standard Emergency"
        }
    ],

    // Donation Camps
    camps: [
        {
            id: "CMP-401",
            name: "Corporate LifeSaver Drive 2026",
            location: "Apex Tower Auditorium, Bay Area",
            organizer: "Rotary Club & Red Cross",
            date: "2026-07-28",
            time: "09:00 AM - 05:00 PM",
            targetUnits: 150,
            registeredDonors: 112,
            status: "Upcoming"
        },
        {
            id: "CMP-402",
            name: "University Blood Heroes Camp",
            location: "State University Gym Campus",
            organizer: "Student Medical Corps",
            date: "2026-08-02",
            time: "10:00 AM - 04:00 PM",
            targetUnits: 200,
            registeredDonors: 145,
            status: "Upcoming"
        },
        {
            id: "CMP-403",
            name: "Weekend Community Blood Drive",
            location: "Central Community Park Pavilion",
            organizer: "City Health Department",
            date: "2026-08-08",
            time: "08:30 AM - 02:30 PM",
            targetUnits: 100,
            registeredDonors: 68,
            status: "Scheduled"
        }
    ],

    // System Recent Activities Log
    activities: [
        {
            id: 1,
            icon: "fa-solid fa-truck-medical",
            color: "badge-soft-danger",
            title: "Emergency Request Created",
            desc: "3 units of O- requested by St. Jude Hospital for Jonathan Myers",
            time: "10 mins ago"
        },
        {
            id: 2,
            icon: "fa-solid fa-vial-circle-check",
            color: "badge-soft-success",
            title: "Stock Replenished",
            desc: "Added +10 units of O+ from Central Inventory Drive",
            time: "45 mins ago"
        },
        {
            id: 3,
            icon: "fa-solid fa-circle-check",
            color: "badge-soft-primary",
            title: "Request Approved",
            desc: "REQ-9903 (A+, 2 units) approved for Metropolitan General",
            time: "2 hours ago"
        },
        {
            id: 4,
            icon: "fa-solid fa-user-plus",
            color: "badge-soft-info",
            title: "New Donor Registered",
            desc: "Dr. Alexander Wright registered as O+ donor",
            time: "4 hours ago"
        },
        {
            id: 5,
            icon: "fa-solid fa-triangle-exclamation",
            color: "badge-soft-warning",
            title: "Low Stock Alert triggered",
            desc: "AB- inventory dropped to 8 units (Threshold: 15)",
            time: "6 hours ago"
        }
    ]
};
