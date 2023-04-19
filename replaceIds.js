

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

module.exports = {
    replaceIdActivityLog,
    replaceIdBookings,

}
