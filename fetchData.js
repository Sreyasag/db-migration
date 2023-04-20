const db = require('./connection');
const ObjectID = require('mongodb').ObjectId;


const getSocialMedia = async () => {
    const sql = 
        `select  id as _id, name, image_url, is_active, created_at as createdAt, 
        updated_at as updatedAt  from social_master`;

    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getCountries = async () => {
    const sql = 
        `select  cm.id as _id, cm.country_name as name, 
        c.iso3,cm.flag as flag_url, c.dial_code,
        now() as createdAt, now() as updatedAt
        from country c 
        join countrytranslation ct on ct.country_id = c.id
        left join country_master cm on cm.country_name = ct.name
        where ct.language = 'en' and cm.id is not null order by cm.id;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getSubjects = async () => {
    const sql = 
        `select sm.id as _id, sm.name as subject_name, sm.image_url, sm.is_active,
        ifnull((select json_arrayagg(json_object(
            "title",hm.title,
            "header",hm.header,
            "is_active",hm.is_active,
            "status",hm.status,
            "createdAt",pm.created_at,
            "updatedAt",pm.updated_at)) 
        from header_master hm 
        join parameter_list_master pm 
        on pm.header_id = hm.id and pm.subject_id = sm.id), json_array()) as parameters
        from subject_master sm;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getActivityLog = async () => {
    const sql = 
        `select  al.id as _id, al.ip_address, al.uuid, al.user_id, 
            json_object(
                "source", JSON_EXTRACT(al.metadata, '$.source'),
                "medium", JSON_EXTRACT(al.metadata, '$.medium'),
                "campaign", JSON_EXTRACT(al.metadata, '$.campaign'),
                "createdAt", JSON_EXTRACT(al.metadata, '$.created_at'),
                "updatedAt", JSON_EXTRACT(al.metadata, '$.updated_at')
            ) as campaign_meta,
            json_object(
                "grade", JSON_EXTRACT(al.metadata, '$.grade'),
                "subject", JSON_EXTRACT(al.metadata, '$.subject'),
                "companies", ifnull(JSON_EXTRACT(al.metadata, '$.comparator'),json_array()),
                "booking_id", JSON_EXTRACT(al.metadata, '$.booking_id'),
                "teaching_format", JSON_EXTRACT(al.metadata, '$.teaching_format'),
                "no_of_classes_id",  JSON_EXTRACT(al.metadata, '$.no_of_classes_id'),
                "name", JSON_EXTRACT(al.metadata, '$.name'),
                "email", JSON_EXTRACT(al.metadata, '$.email'),
                "terms", JSON_EXTRACT(al.metadata, '$.terms'),
                "kid_name", JSON_EXTRACT(al.metadata, '$.kid_name'),
                "date_time", JSON_EXTRACT(al.metadata, '$.date_time'),
                "mobile", JSON_EXTRACT(al.metadata, '$.mobile'),
                "company_name", JSON_EXTRACT(al.metadata, '$.company_name'),
                "country_name", JSON_EXTRACT(al.metadata, '$.country_name'),
                "rating", JSON_EXTRACT(al.metadata, '$.rating'),
                "description", JSON_EXTRACT(al.metadata, '$.description'),
                "createdAt", JSON_EXTRACT(al.metadata, '$.created_at'),
                "updatedAt", JSON_EXTRACT(al.metadata, '$.updated_at')
            ) as metadata,
            al.session_duration, al.created_at as createdAt, al.updated_at as updatedAt
        from activity_log al;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getBookings = async () => {
    const sql = 
        `select b.id as _id, cm.name as course_name,
		IF(b.type='customer',0,1) as manual_booking, u.first_name as name, b.email, b.mobile as phone, 
        b.country_id, b.subject_id as subject , cast(gm.name as unsigned) as grade, b.dateTime as date_time, null as query,
        rl.refered_by as referral, rl.reward, b.company_id, b.status, 'demo_session' as booking_type, b.created_at as createdAt, b.updated_at as updatedAt
		from booking b
		left join referal_log rl on rl.booking_id = b.id 
		left join customer cr on cr.id = b.customer_id 
	 	left join users u on u.id  = cr.user_id  
        left join grade_master gm on gm.id = b.grade_id
		join courses_master cm on cm.id = b.course_id 
	
		union ALL 
		
		select c.id as _id, null as course_name, null as manual_booking, c.name, c.email, c.mobile as phone, 
        u.country_id, null as subject_id, null as grade, concat(c.date, ' ', c.time) as date_time, 
        c.query, null as referral, null as reward,
		null as company_id, null as status, 'counselling' as booking_type,
		c.created_at as createdAt, c.updated_at as updatedAt
		from counselling c
	 	left join customer cr on cr.id = c.customer_id 
	 	left join users u on u.id  = cr.user_id or u.mobile = c.mobile  
		order by createdAt desc;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getCampaigns = async () => {
    const sql = 
        `select cm.id as _id,
        cm.title,
        cm.description,
        cm.campaign,
        cm.url as campaign_url,
        cm.page,
        cm.budget,
        cm.date as start_date_time,
        cm.is_active as active_status, 
        cm.social_id as source,
        cm.medium as joining_medium,
        json_object("total_customer_booking", (select (count(b.id)) from campaign_leads cl 
                        join campaign_master cm1 on cm1.id=cl.campaign_id 
                        join booking b on b.id=cl.booking_id 
                        where b.type = 'customer'and cm1.id=cm.id),
                    "total_manual_booking", (select (count(b.id)) as total_manual_booking from campaign_leads cl 
                        join campaign_master cm2 on cm2.id=cl.campaign_id 
                        join booking b on b.id=cl.booking_id 
                        where b.type = 'admin' and cm2.id=cm.id),
                    "total_signups",(select (count(al.id)) as counts
                        from activity_log al
                        join campaign_leads cl on cl.user_id = al.user_id and cl.last_login  = al.last_login
                        join campaign_master cm3 on cm3.id=cl.campaign_id 
                        where al.type='signup' and al.category='campaign' and cm3.id = cm.id),
                    "total_bookings",(select (count(b.id)) as total_customer_booking from campaign_leads cl 
                        join campaign_master cm4 on cm4.id=cl.campaign_id 
                        join booking b on b.id=cl.booking_id 
                        where cm4.id=cm.id),
                    "total_click",(select (count(al.uuid)) as total_clicks from activity_log al
                        join campaign_master cm5 on cm5.source=JSON_UNQUOTE(JSON_EXTRACT(al.campaign_meta,'$.source'))
                        and cm5.medium=JSON_UNQUOTE(JSON_EXTRACT(al.campaign_meta,'$.medium'))
                        and cm5.campaign = JSON_UNQUOTE(JSON_EXTRACT(al.campaign_meta,'$.campaign')) where cm5.id=cm.id),
                    "total_sessions",(select (count(b.last_login)) as counts from(
                        select cm6.budget as budget,max(al.session_duration), al.last_login
                        from activity_log al
                        join campaign_leads cl on cl.user_id = al.user_id and cl.last_login  = al.last_login
                        join campaign_master cm6 on cm6.id=cl.campaign_id 
                        where al.category='campaign' and cm6.id=cm.id
                        group by last_login order by last_login) as b),
                    "customer_bookings",ifnull((select json_arrayagg(b.id) as total_manual_booking from campaign_leads cl 
                        join campaign_master cm7 on cm7.id=cl.campaign_id 
                        join booking b on b.id=cl.booking_id 
                        where b.type = 'customer' and cm7.id=cm.id), json_array()),
                    "manual_bookings",ifnull((select json_arrayagg(b.id) as total_manual_booking from campaign_leads cl 
                        join campaign_master cm8 on cm8.id=cl.campaign_id 
                        join booking b on b.id=cl.booking_id 
                        where b.type = 'admin' and cm8.id=cm.id), json_array()),
                    "signups",ifnull((select json_arrayagg(al.user_id) as signups
                        from activity_log al
                        join campaign_leads cl on cl.user_id = al.user_id and cl.last_login  = al.last_login
                        join campaign_master cm9 on cm9.id=cl.campaign_id 
                        where al.type='signup' and al.category='campaign' and cm9.id=cm.id), json_array())
            ) as campaign_leads,
        cm.created_at as createdAt , cm.updated_at as updatedAt
        from campaign_master cm;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getUsers = async () => {
    const sql = 
        `select u.id as _id, 
        u.first_name as name,
        u.kid_name,
        u.mobile,
        u.country_id,
        u.sent_otp as otp,
        u.otp_verified as verified,
        null as otp_createdAt, 
        null as otp_updatedAt, 
        u.referal_link as referral_link,
        u.refered_by as referred_by_user,
        u.is_active,
        null as \`rank\`,
        u.upi as upi_paypal_id, 
        ifnull((select json_arrayagg(b.id) from booking b where b.customer_id = c.id group by b.customer_id), json_array()) as bookings,
        null as address,
        u.user_profile_image as profile_pic,
        u.email,
        ifnull((select json_arrayagg(json_object(
                "id",r.id,
                "company_id",r.company_id,
                "rating",r.rating,
                "review",r.description,
                "sentiment",r.sentiment,
                "is_approved",r.is_approved,
                "createdAt",r.created_at,
                "updatedAt",r.updated_at
            ))
            from review r where r.customer_id = c.id group by r.customer_id), json_array()) as reviews,
        u.kid_name,
        (select count(*) from referal_log rl where rl.refered_by = u.uniq_referal_id group by rl.refered_by ) as total_referred_bookings,
        u.referal_signups as total_referred_signups,
        (select sum(rl.reward) from referal_log rl join booking b on b.id = rl.booking_id and 
            b.status="Completed" where rl.refered_by = u.uniq_referal_id group by rl.refered_by ) as total_amount_earned, 
        u.created_at as createdAt,
        u.updated_at as updatedAt  
        from users u
        join customer c on c.user_id = u.id ;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

const getEvents = async () => {
    const sql = 
        `select em.id as _id, 
        em.event_banner_image as image_url, 
        em.name as title, 
        em.details as description, 
        em.subject_id, 
        em.organized_by, 
        em.joining_method, 
        json_object(
            "start_age",json_extract(em.eligibility, '$[0]'),
            "end_age",json_extract(em.eligibility, '$[1]'),
            "createdAt", null,
            "updatedAt", null
        ) as age_criteria,
        em.joining_fee as fee,
        em.platform_fee, 
        em.rules_and_guidlines as rules_and_guidelines, 
        em.event_date,  
        em.address,
        em.total_participants,
        em.is_delete as deleted, 
        (select json_arrayagg(json_object(
            "name",pm.name,
            "mobile",pm.mobile,
            "email",pm.email,
            "grade",cast(g.name as unsigned),
            "createdAt", pm.created_at,
            "updatedAt", pm.updated_at
        )) from participant_master pm 
           left join grade_master g on pm.grade_id = g.id
           where pm.event_id = em.id) as participants,
        (select json_arrayagg(json_object(
            "title", pr.title,
            "prize", pr.description,
            "createdAt", pr.created_at,
            "updatedAt", pr.updated_at
        )) from prize_master pr where pr.event_id = em.id) as prize_rewards,
        (select json_arrayagg(json_object(
            "query",fm.query,
            "answer",fm.answer,
            "createdAt", fm.created_at,
            "updatedAt", fm.updated_at
        )) from FAQ_master fm where fm.event_id = em.id) as faq,
        em.created_at as createdAt, 
        em.updated_at as updatedAt
        from event_master em;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}
const getCompanies = async () => {
    const sql = 
        `select c.id as _id,
        c.name,
		u.email,
        u.mobile as phone,
        c.website_url,
        null as state,
        c.about_us as about,
        c.offerings,
        c.slug_name,
        c.student_count,
        c.headquarter,
        c.founder,
        if((select count(*) from banner where company_id = c.id)=0, 0, 1) as is_leveraged,
		(select json_arrayagg(json_object(
				"country_id", null,
                "subject", sm1.name,
                "position", b1.top_sequence,
                "createdAt", b1.created_at,
				"updatedAt", b1.updated_at 
			)) from banner b1
				left join subject_master sm1 on b1.subject_id = sm1.id
				where company_id = c.id ) as leverage_info,
        IF(LOCATE(',', c.session_types) > 0, 
            json_array(SUBSTRING_INDEX(c.session_types,', ',1),SUBSTRING_INDEX(c.session_types,', ',-1) ) , 
            json_array(c.session_types) 
        ) as session_types,
        c.funding as fundings,
        c.logo as logo_url,
        c.cover_image as cover_image_url,
        c.usp,
        c.founded_in,
        u.username,
        u.password,
        json_array() as grades,
        (select json_arrayagg(json_object(
            "url",i.url,
            "type",i.type,
            "subject_id",i.subject_id,
            "createdAt",i.created_at,
            "updatedAt",i.updated_at )) 
            from inventory i
            where i.company_id = c.id) as inventory,
        u.password_reset_token as password_reset_token,
        u.is_active,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        (select json_arrayagg(subject_id) from JSON_TABLE(c.subjects, '$[*]'
                        COLUMNS (
                            subject_id int PATH '$.subject_id'
                        )) jt) as subject_id,
        c.countries,
        -- (select JSON_ARRAYAGG(c.id) AS country_ids 
        -- 	FROM country_master c
        -- 	where JSON_CONTAINS(c.countries, JSON_QUOTE(c.name))) as countries,
        c.no_of_reviews as total_reviews,
        c.avg_rating,
        json_object(
            "positive", c.total_positive,
            "neutral", c.total_neutral,
            "negative", c.total_negative,
            "updatedAt", null) as 	sentiment,
        (select json_arrayagg(json_object(
            "user_id",u1.id,
            "rating",r.rating,
            "review",r.description,
            "sentiment",r.sentiment,
            "is_approved",r.is_approved,
            "createdAt",r.created_at,
            "updatedAt",r.updated_at )) 
            from review r
            left join customer c1 on c1.id = r.customer_id 
            left join users u1 on c1.user_id = u1.id 
            where r.company_id = c.id) as edjust_user_reviews,
        
        (select json_arrayagg(json_object(
        	"company_name",rcm.name,
         	"image_url",rcm.image_url,
            "review_data", (select json_arrayagg(json_object(
				"rating",tpr.rating,
				"review",tpr.review,
				"user_name",tpr.customer_name,
				"headline",tpr.headline,
				"sentiment",tpr.sentiment,
				"review_date",tpr.date,
				"createdAt",tpr.created_at,
				"updatedAt",tpr.updated_at 
				)) from third_party_reviews tpr
                where tpr.review_company_id = rcm.id and tpr.company_id = c.id),
			"sentiment", json_object(
				"positive", (select count(*) 
					from third_party_reviews 
                    where review_company_id = rcm.id and company_id = c.id and sentiment = "Positive"),
				"neutral", (select count(*) 
					from third_party_reviews 
                    where review_company_id = rcm.id and company_id = c.id and sentiment = "Neutral"),
				"negative", (select count(*) 
					from third_party_reviews 
                    where review_company_id = rcm.id and company_id = c.id and sentiment = "Negative"),
				"updatedAt",now() ),
			"createdAt",rcm.created_at,
            "updatedAt",rcm.updated_at 
             )) from review_company_master rcm ) as third_party_reviews,
             
       	(select json_arrayagg(json_object(
			"id",ccid,
            "course_name", cmname,
            "subject_id", cpnsubject_id,
            "grades",(select JSON_ARRAYAGG(cast(gm1.name as unsigned)) 
			 	FROM grade_master gm1
			 	where JSON_CONTAINS(ccgrade_ids, cast(gm1.id as char))),
			"curriculum", ifnull((select json_arrayagg(json_object(
				"curriculum_name", crlm.name,
                "topics", ifnull((select json_arrayagg(json_object(
					"topic_name",tm.name,
                    "sub_topics",ifnull((select json_arrayagg(cstm.name) 
						from course_subtopic_master cstm
                        where cstm.topic_id = tm.id), json_array()),
                    "createdAt",tm.created_at,
					"updatedAt",tm.updated_at
                )) from course_topic_master tm
                where tm.curriculum_id = crlm.id),json_array()),
                "createdAt",crlm.created_at,
				"updatedAt",crlm.updated_at
				)) from curriculum crlm 
                where crlm.id = curriculum_id ),json_array()),
			"prices",ifnull(json_array(
					json_object(
						"country_id", 1,
						"total_price", ifnull(india_price,price),
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
					json_object(
						"country_id", 2,
						"total_price", usa_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
					json_object(
						"country_id", 3,
						"total_price",canada_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
                    json_object(
						"country_id", 4,
						"total_price", singapore_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
                    json_object(
						"country_id", 5,
						"total_price", australia_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
                    json_object(
						"country_id", 6,
						"total_price", middleeast_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
                    json_object(
						"country_id", 7,
						"total_price", uk_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					),
                    json_object(
						"country_id", 8,
						"total_price", china_price,
						"price_per_session", null,
						"createdAt", created_at,
						"updatedAt", updated_at                        
					)                    
				) , json_array()),
            "no_of_classes", no_of_classes,
            "duration", duration,
            "format", format,
            "createdAt", created_at,
            "updatedAt", updated_at            
		))
          
		from (select cc.id as ccid, cm.id as cmid , cm.name as cmname, cpn.company_id as cpncompany_id, cpn.subject_id as cpnsubject_id,
			cpn.duration as cpnduration, ncm.name as no_of_classes, cpn.duration as duration, tfm.name as format, cc.grade_ids as ccgrade_ids,
            cpn.price as price, cpn.india_price as india_price, cpn.usa_price, cpn.canada_price, cpn.singapore_price, cpn.australia_price, cpn.middleeast_price,cpn.uk_price, cpn.china_price,
            cc.curriculum_id as curriculum_id,
            cpn.created_at as created_at, cpn.updated_at as updated_at
			from company_courses cc
			left join company_price_number_classes cpn on cpn.company_id = cc.company_id and cpn.subject_id = cc.subject_id 
				and cpn.number_of_class_id = cc.number_of_class_id and JSON_CONTAINS(cc.grade_ids, CAST(cpn.grade_id as CHAR), '$')
			left join courses_master cm on cm.id = cpn.course_id
            left join number_of_classes_master ncm on ncm.id = cpn.number_of_class_id
            left join teaching_format_master tfm on tfm.id = cpn.format_id
            group by cmid) as a
		where a.cpncompany_id = c.id
		group by  a.cpncompany_id) as courses
        
    from company_master c
    left join users u on u.id = c.user_id;`;
    
    try {
        const [data] = await db.promise().query(sql);
        const idMap = {}
        data.forEach(doc => { 
            const objectID = new ObjectID()
            idMap[doc._id] = objectID
            doc._id =  objectID
        });        
        return [data, idMap]

    } catch (error) {
        throw error
    }
}

module.exports = {
    getSocialMedia,
    getCountries,
    getSubjects,
    getActivityLog,
    getBookings,
    getCampaigns,
    getUsers,
    getEvents,
    getCompanies
};
