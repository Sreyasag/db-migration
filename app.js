const db = require('./connection');
const fs = require('fs');

const { getSocialMedia, getCountries, getSubjects, getActivityLog, getBookings, getCampaigns, getUsers, getEvents, getCompanies } = require('./fetchData');
const { replaceIdActivityLog, replaceIdBookings } = require('./replaceIds');

const getCollections = async () => {
    try {
        // const [socialMedia, socialMediaIdMap] = await getSocialMedia();
        // console.log('socialMedia',socialMedia, 'socialMediaIdMap', socialMediaIdMap);
        // const [countries, countriesIdMap] = await getCountries();
        // console.log('countries', countries, 'countriesIdMap', countriesIdMap);
        // const [subjects, subjectsIdMap] = await getSubjects();
        // console.log('subjects', subjects, 'subjectsIdMap', subjectsIdMap);
        // const [activityLog, activityLogIdMap] = await getActivityLog();
        // console.log('activityLog', activityLog, 'activityLogIdMap', activityLogIdMap);
        // const [bookings, bookingsIdMap] = await getBookings();
        // console.log('bookings', bookings, 'bookingsIdMap', bookingsIdMap);
        // const [campaigns, campaignsIdMap] = await getCampaigns();
        // console.log('campaigns', campaigns, 'campaignsIdMap', campaignsIdMap);
        // const [users, usersIdMap] = await getUsers();
        // console.log('users', users, 'usersIdMap', usersIdMap);
        // const [events, eventsIdMap] = await getEvents();
        // console.log('events', events, 'eventsIdMap', eventsIdMap);
        const [companies, companiesIdMap] = await getCompanies();
        console.log('companies', companies[1], 'companiesIdMap', companiesIdMap);
        //fs.writeFileSync('companies.txt', JSON.stringify(companies[1]));


        //map mysqlId to mongoId 

        // const updatedActivityLog = replaceIdActivityLog(activityLog,usersIdMap,bookingsIdMap)
        // console.log('updatedActivityLog', updatedActivityLog);
        // const updatedBookings = replaceIdBookings(bookings, countriesIdMap, subjectsIdMap, companiesIdMap)
        // console.log('updatedBookings', updatedBookings);
        

    } catch (error) {
        console.log(error)
    }
      
}

getCollections()
.then(()=> {db.end()});
