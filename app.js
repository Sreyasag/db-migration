const db = require('./connection');
const fs = require('fs');

const { getSocialMedia, getCountries, getSubjects, getActivityLog, getBookings, getCampaigns, getUsers, getEvents, getCompanies } = require('./fetchData');
const { replaceIdActivityLog, replaceIdBookings, replaceIdCampaigns, replaceIdUsers } = require('./replaceIds');

const getCollections = async () => {
    try {

        //get data
        // const [socialMedia, socialMediaIdMap] = await getSocialMedia();
        // console.log('socialMedia',socialMedia, 'socialMediaIdMap', socialMediaIdMap);
        const [countries, countriesIdMap] = await getCountries();
        // console.log('countries', countries, 'countriesIdMap', countriesIdMap);
        // const [subjects, subjectsIdMap] = await getSubjects();
        // console.log('subjects', subjects, 'subjectsIdMap', subjectsIdMap);
        // const [activityLog, activityLogIdMap] = await getActivityLog();
        // console.log('activityLog', activityLog, 'activityLogIdMap', activityLogIdMap);
        const [bookings, bookingsIdMap] = await getBookings();
        // console.log('bookings', bookings, 'bookingsIdMap', bookingsIdMap);
        // const [campaigns, campaignsIdMap] = await getCampaigns();
        // console.log('campaigns', campaigns, 'campaignsIdMap', campaignsIdMap);
        const [users, usersIdMap] = await getUsers();
        // console.log('users', users, 'usersIdMap', usersIdMap);
        // const [events, eventsIdMap] = await getEvents();
        // console.log('events', events, 'eventsIdMap', eventsIdMap);
        const [companies, companiesIdMap] = await getCompanies();
        // console.log('companies', companies, 'companiesIdMap', companiesIdMap);

       // write to file
    //    fs.writeFileSync('data/socialMedia.txt', JSON.stringify(socialMedia));
    //    fs.writeFileSync('data/countries.txt', JSON.stringify(countries));
    //    fs.writeFileSync('data/subjects.txt', JSON.stringify(subjects));
    //    fs.writeFileSync('data/activityLog.txt', JSON.stringify(activityLog));
    //    fs.writeFileSync('data/bookings.txt', JSON.stringify(bookings));
    //    fs.writeFileSync('data/campaigns.txt', JSON.stringify(campaigns));
    //    fs.writeFileSync('data/users.txt', JSON.stringify(users));
    //    fs.writeFileSync('data/events.txt', JSON.stringify(events));
    //    fs.writeFileSync('companies.txt', JSON.stringify(companies));


        //map mysqlId to mongoId 

        // const updatedActivityLog = replaceIdActivityLog(activityLog,usersIdMap,bookingsIdMap)
        // console.log('updatedActivityLog', updatedActivityLog);
        // const updatedBookings = replaceIdBookings(bookings, countriesIdMap, subjectsIdMap, companiesIdMap)
        // console.log('updatedBookings', updatedBookings);
        // const updatedCampaigns = replaceIdCampaigns(campaigns, socialMediaIdMap, usersIdMap, bookingsIdMap)
        // console.log('updatedCampaigns', updatedCampaigns);
        const updatedUsers = replaceIdUsers(users, countriesIdMap,usersIdMap, bookingsIdMap, companiesIdMap)
        console.log('updatedUsers', updatedUsers);

    } catch (error) {
        console.log(error)
    }
      
}

getCollections()
.then(()=> {db.end()});
