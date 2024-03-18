import { GoBackLink } from "../../components/General/GoBackLink"

export default function PrivacyPolicy() {
    return (
        <section className="p-6">
            <div className="absolute top-2 left-2 z-10">
                <GoBackLink href={-1} />
            </div>
            <br></br>
            <h1 className="h1">Privacy Policy for RePlate</h1>
            <h3>Effective Date: 15/03/2024</h3>
            <p>Thank you for using RePlate! This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our mobile application and related services.</p>

            <h2>1. Information We Collect</h2>
            <p>RePlate collects the following type of information:</p>
            <ul>
                <li>First Name</li>
                <li>Last Name</li>
                <li>Email Address</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information collected for the following purposes:</p>
            <ul>
                <li>To create and manage user accounts</li>
                <li>To communicate with users, including providing updates and information about our services</li>
                <li>To personalise user experiences and improve our services</li>
                <li>To respond to user enquiries and provide customer support</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>RePlate does not share or disclose your personal information with third parties except in the following circumstances:</p>            
            <ul>
                <li>With your consent: We may share your information with third parties if you provide consent to do so.</li>
                <li>Legal requirements: We may disclose your information if required to do so by law or in response to a legal request.</li>
                <li>Protection of rights: We may disclose your information to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>RePlate takes reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

            <h2>5. Data Retention</h2>
            <p>We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.</p>

            <h2>6. Changes to This Privacy Policy</h2>
            <p>RePlate may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at replate@gmail.com.
                By using RePlate, you agree to the collection and use of information in accordance with this Privacy Policy.</p>

        </section>
    )
}