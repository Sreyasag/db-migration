

const replaceIdActivityLog = (socialMedia,userIdMap, bookingIdMap) => {
    const updatedSocialMedia = socialMedia.map(obj => {
        const user_id = obj.user_id != null ? userIdMap[obj.user_id] : null
        const booking_id = obj.metadata.booking_id != null ? bookingIdMap[obj.metadata.booking_id] : null;
        const updatedObj = { ...obj, user_id, metadata: { ...obj.metadata, booking_id } };
        return updatedObj;
    });
    return updatedSocialMedia;
}

const replaceIdBookings = (bookings,countryIdMap, subjectIdMap, companyIdMap) => {
    const updatedBookings = bookings.map(obj => {
        const country_id = obj.country_id != null ? countryIdMap[obj.country_id] : null
        const subject = obj.subject != null ? subjectIdMap[obj.subject] : null;
        const company_id = obj.company_id != null ? companyIdMap[obj.company_id] : null
        const updatedObj = { ...obj, country_id, subject, company_id };
        return updatedObj;
    });
    return updatedBookings;
}

const replaceIdCampaigns = (campaigns,socialIdMap,userIdMap, bookingsIdMap) => {
    const updatedCampaigns = campaigns.map(obj => {
        const source = obj.source != null ? socialIdMap[obj.source] : null
        const signups =  obj.campaign_leads.signups.map(refId => userIdMap[refId]);
        const customer_bookings =  obj.campaign_leads.customer_bookings.map(refId => bookingsIdMap[refId]);
        const manual_bookings =  obj.campaign_leads.manual_bookings.map(refId => bookingsIdMap[refId]);      
        const updatedObj = {
            ...obj, 
            source, 
            campaign_leads:{
                ...obj.campaign_leads,
                signups,
                customer_bookings,
                manual_bookings
            }
         };
        return updatedObj; 
    });
    return updatedCampaigns;
}

const replaceIdUsers = (users, countryIdMap, userIdMap, bookingsIdMap, companiesIdMap) => {
    const updatedUsers = users.map(obj => {
        const country_id = obj.country_id != null ? countryIdMap[obj.country_id] : null
        const referred_by_user = obj.referred_by_user != null ? userIdMap[obj.referred_by_user] : null
        const bookings =  obj.bookings.map(refId => bookingsIdMap[refId]);
        const reviews = obj.reviews.map(review => {
            const company_id = obj.company_id != null ? companiesIdMap[obj.company_id] : null
            return {
                ...review,
                company_id
            }
        })
        const updatedObj = {
            ...obj, 
            country_id,
            referred_by_user,
            bookings,
            reviews
        };
        return updatedObj; 
    });
    return updatedUsers;
}

// const updatedMongoObjArray = mysqlObjArray.map(obj => {
//     const updatedRefs = obj.refIds.map(refId => mysqlToMongoMap[refId]);
//     const updatedObj = { ...obj, refIds: updatedRefs };
//     return updatedObj;
// });

module.exports = {
    replaceIdActivityLog,
    replaceIdBookings,
    replaceIdCampaigns,
    replaceIdUsers,
}
