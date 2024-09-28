import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../admin/admin.css"
import client from "../assets/client.png"
import appointmentimg from "../assets/appointment.png"
import serviceimg from "../assets/service.png"
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { color } from 'chart.js/helpers';
import man1 from "../assets/man1.png"
import man2 from "../assets/man2.png"
import man3 from "../assets/man3.png"
import woman1 from "../assets/woman1.png"
import woman2 from "../assets/woman2.png"
import woman3 from "../assets/woman3.png"
import woman4 from "../assets/woman4.png"
import woman5 from "../assets/woman5.png"
import woman6 from "../assets/woman6.png"
import staff from "../assets/employee.png"
import Home from "../Homepage/Home";


const AdminInterface = () => {
    const [toggleState, setToggleState] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [paidAppointments, setPaidAppointments] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [priceData, setPriceData] = useState([]);

    const totalAmount = services.reduce((total, service) => total + service.Price, 0);
  

    const employeeImages = [
        woman1,
        woman2,
        man3,
        man1,
        woman3,
        woman4,
        man2,
        woman5,
        woman6,
    ];

    const toggleTab = (index) => {
        setToggleState(index);
    }


    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8081/customers');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('http://localhost:8081/employee');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchEmployee();
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:8081/appointment');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAppointments(data);
                countServices(data);
                prepareLineChartData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAppointments();
    }, []);

   

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:8081/service');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchServices();
    }, []);

    const countServices = (data) => {
        const serviceCount = data.reduce((acc, appointment) => {
            acc[appointment.ServiceName] = (acc[appointment.ServiceName] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(serviceCount).map(([name, count]) => ({
            name,
            value: count,
        }));

        setServiceData(formattedData);
    };

    const prepareLineChartData = (data) => {
        const dateServiceCount = data.reduce((acc, appointment) => {
            const date = new Date(appointment.Date).toLocaleDateString();
            const serviceName = appointment.ServiceName;
            acc[date] = acc[date] || {};
            acc[date][serviceName] = (acc[date][serviceName] || 0) + 1;
            return acc;
        }, {});

        const formattedLineChartData = Object.entries(dateServiceCount).map(([date, services]) => ({
            date,
            ...services,
        }));

        setLineChartData(formattedLineChartData);
    };

    useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await fetch('http://localhost:8081/total-price-per-date');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            // Assuming `Date` comes in ISO format, converting to a more readable format:
            const formattedData = data.map((entry) => ({
              ...entry,
              Date: new Date(entry.Date).toLocaleDateString(), // Format the date
            }));
            setPriceData(formattedData);
          } catch (error) {
            console.error('Error fetching price data:', error);
          }
        };
    
        fetchPriceData();
      }, []);

      
    const totalCustomers = customers.length;
    const totalAppointments = appointments.length;
    const totalServices = services.length;
    const totalEmployee = employee.length;


    const [selectedCustomerID, setSelectedCustomerID] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen2, setIsPopupOpen2] = useState(false);
    const buttonRef = useRef(null);

    const fetchPendingServices = async (customerID) => {
        try {
            const response = await fetch(`http://localhost:8081/pending/${customerID}`);
            const data = await response.json();
            setServices(data);
            setSelectedCustomerID(customerID);
            setIsPopupOpen(true);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    const fetchPaidServices = async (customerID) => {
        try {
            const response = await fetch(`http://localhost:8081/paid/${customerID}`);
            const data = await response.json();
            setServices(data);
            setSelectedCustomerID(customerID);
            setIsPopupOpen2(true);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await fetch('http://localhost:8081/Pending');
                const data = await response.json();
    
                // Create a Map to store unique appointments by customerID
                const uniqueAppointments = new Map();
    
                data.forEach(appt => {
                    if (!uniqueAppointments.has(appt.CustomerID)) {
                        uniqueAppointments.set(appt.CustomerID, appt);
                    }
                });
    
                //setAppointment(data);
                // Convert the Map back to an array
               setPendingAppointments(Array.from(uniqueAppointments.values()));
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
    
        fetchPending();
    }, []);

    useEffect(() => {
        const fetchPaid = async () => {
            try {
                const response = await fetch('http://localhost:8081/paid');
                const data = await response.json();
    
                // Create a Map to store unique appointments by customerID
                const uniqueAppointments = new Map();
    
                data.forEach(appt => {
                    if (!uniqueAppointments.has(appt.CustomerID)) {
                        uniqueAppointments.set(appt.CustomerID, appt);
                    }
                });
    
                //setAppointment(data);
                // Convert the Map back to an array
               setPaidAppointments(Array.from(uniqueAppointments.values()));
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
    
        fetchPaid();
    }, []);

   
    const [selectedEmployee, setSelectedEmployee] = useState('');
   
    const updateAppointment = () => {
        // Make sure to adjust the firstName to get only EmpFName
        const firstName = selectedEmployee;

        // Ensure selectedCustomerID is set correctly
        if (!firstName || !selectedCustomerID) {
            alert('Please select an employee and a customer ID.');
            return;
        }

        // Make the POST request to update the appointment
        axios.post('http://localhost:8081/updateAppointment', { firstName, customerId: selectedCustomerID })
            .then(response => {
                console.log(response.data);
                alert('Appointment updated successfully!');
            })
            .catch(error => {
                console.error('Error updating appointment:', error);
                alert('Failed to update appointment. Please try again.');
            });
    };

    const [employees, setEmployees] = useState([]);
    const fetchEmployeesWithoutAppointments = async () => {
        try {
            const response = await fetch('http://localhost:8081/employees/no-appointments');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployeesWithoutAppointments();
    }, []);

    return (
        <div className='w-screen h-screen flex overflow-hidden'>
            <div className='w-[13%] h-full bg-white border p-2 flex flex-col'>
                <div className='w-full h-[10%] bg-gray-300'></div>

                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Dashboard</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Appointments</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>Clients</button>
                </div>
            </div>

            <div className='w-[87%] h-full bg-gray-100 overflow-y-scroll'>

                <div className={toggleState === 1 ? "content active-content" : "content"}>
                   
                   <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                       
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold'>Overview</h1>
                        </div>

                    <div className='w-[100%] h-[24%] flex mb-3'>
                        
                        <div className='w-[65%] h-[100] flex flex-col justify-between'>
                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={client}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Clients</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalCustomers}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[80%] rounded-lg' src={appointmentimg}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Appointments</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalAppointments}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                              </div>

                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center mb-3'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={serviceimg}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Services</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalServices}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <div className='w-[70%] bg-violet-400 rounded-lg flex items-end'>
                                                        <img className='w-[100%] rounded-lg top-1 relative' src={staff}></img>
                                                    </div>   
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Employee</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalEmployee}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                </div>    
                        </div>

                        <div className='pie rounded-lg z-40 border'>
                                <PieChart width={400} height={400}  style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>  
                                         <Pie
                                            data={serviceData}
                                            innerRadius={100}
                                            outerRadius={170}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            cy={195}
                                        >
                                            {serviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                                            ))}
                                        </Pie>
                                        <Tooltip/> 
                                       <Legend wrapperStyle={{position: "static", right: 0, bottom: 0}}/>         
                                </PieChart>    
                                
                        </div>

                        </div>
                        
                        <div className='w-[100%] h-[40%] bg-white flex rounded-lg relative p-2 mb-3 border'>
                            <LineChart width={1300} height={360} style={{width: "97%", height: "100%"}}  data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="date"/><YAxis domain={[1, 'dataMax + 1']}/>
                                <Tooltip/>
                                <Legend align="center"  layout="horizontal" wrapperStyle={{ width: "100%", paddingLeft: "3%"}}/>
                                {services.map((service) => (
                                    <Line
                                        key={service.ServiceName}
                                        type="monotone"
                                        dataKey={service.ServiceName}
                                        stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                        activeDot={{ r: 8 }}
                                        strokeWidth={3}
                                    />
                                ))}        
                            </LineChart>
                        </div>
                        
                        <div className='w-[100%] h-[50%] pb-5 flex'>
                            <div className='w-[40%] h-[100%] bg-white rounded-lg p-5 overflow-y-scroll border'>
                                {employee.map((employee, index) => (
                                    <div className='w-[100%] h-[20%] bg-gray-100 mb-2 flex border rounded-lg'>
                                        <div className='w-[20%] h-[100%] bg-gray-100 p-2'>
                                            <div className='w-[100%] h-[100%] bg-white flex items-end justify-center relative rounded-lg'>
                                                <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                            </div>  
                                        </div>
                                        <div className='w-[85%] h-[100%] flex flex-col items-centers justify-center'> 
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-xl font-bold text-gray-600' key={employee.EmployeeID}>{employee.EmpFName} {employee.EmpLName}</h1>
                                            </div>
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-lg text-gray-600' key={employee.EmployeeID}>{employee.Specialization}</h1>
                                            </div> 
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='w-[60%] h-[100%] bg-white flex items-center justify-center pr-5 ml-3 rounded-lg border'>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="TotalIncome" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        </div> 
                    </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                   
                    <div  className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                        
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold'>Upcoming Appointments</h1>
                        </div>

                        <div className='w-[100%] h-[30%] bg-white mb-3 p-3 flex rounded-lg border'>
                            {employees.length === 0 ? (
                                    <h2 className="text-lg font-light">No employee currently available.</h2>
                                ) : (
                                        <div className='w-[100%] h-[100%] rounded-lg'>
                                             <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-xl font-semibold'>Available Employee</h1>
                                             </div>
                                             <div className='w-[100%] h-[70%] overflow-y-scroll'>
                                                {employees.map((employee, index) => (
                                                    <div className='w-[100%] h-[100%] mb-2 flex border rounded-lg'>
                                                        <div className='w-[15%] h-[100%] bg-blue-300'>

                                                        </div>
                                                        <div className='w-[13%] h-[100%]'>
                                                            <div className='w-[100%] h-[40%] flex items-end justify-center'>
                                                                <h1 className='text-lg'>Employee ID</h1>
                                                            </div>
                                                            <div className='w-[100%] h-[60%] flex items-center justify-center'>
                                                                <h1 className='text-xl font-semibold'>{employee.EmployeeID}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[13%] h-[100%]'>
                                                            <div className='w-[100%] h-[40%] flex items-end justify-center'>
                                                                <h1 className='text-lg'>First name</h1>
                                                            </div>
                                                            <div className='w-[100%] h-[60%] flex items-center justify-center'>
                                                                <h1 className='text-xl font-semibold'>{employee.EmpFName}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[20%] h-[100%]'>
                                                            <div className='w-[100%] h-[40%] flex items-end justify-center'>
                                                                <h1 className='text-lg'>Last name</h1>
                                                            </div>
                                                            <div className='w-[100%] h-[60%] flex items-center justify-center'>
                                                                <h1 className='text-xl font-semibold'>{employee.EmpLName}</h1>
                                                            </div>
                                                        </div>
                                                       <div className='w-[25%] h-[100%]'>
                                                            <div className='w-[100%] h-[40%] flex items-end justify-center'>
                                                                <h1 className='text-lg'>Specialization</h1>
                                                            </div>
                                                            <div className='w-[100%] h-[60%] flex items-center justify-center'>
                                                                <h1 className='text-xl font-semibold'>{employee.Specialization}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[20%] h-[100%]'>
                                                            <div className='w-[100%] h-[40%] flex items-end justify-center'>
                                                                <h1 className='text-lg'>Contact No.</h1>
                                                            </div>
                                                            <div className='w-[100%] h-[60%] flex items-center justify-center'>
                                                                <h1 className='text-xl font-semibold'>0{employee.Phone}</h1>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                     
                                        </div>
                            )}
                        </div>

                        <div className='w-[100%] h-[5%] mb-2 flex justify-between'>
                                <div className='w-[49.5%] h-[100%]'>
                                    <div className='w-[100%] h-[100%] bg-blue-400 flex items-center justify-center rounded-lg border'><h1 className='text-white font-semibold'>Pending Services</h1></div>
                                </div>
                                <div className='w-[49.5%] h-[100%]'>
                                    <div className='w-[100%] h-[100%] bg-green-400 flex items-center justify-center rounded-lg border'><h1 className='text-white font-semibold'>Paid Services</h1></div>
                                </div>
                        </div>

                        <div className='w-[100%] h-[50%] flex justify-between'>
                            
                            <div className='w-[49.5%] h-[100%] bg-white rounded-lg p-3 flex '>  
                                    {pendingAppointments.length > 0 ? (
                                    <div className='flex-col h-[100%] w-[100%] overflow-y-scroll'>
                                       {pendingAppointments.map((appt, index) => (
                                        <div className='w-[100%] h-[20%] bg-gray-100 rounded-lg border mb-2'>
                                           <div className='w-[100%] h-[100%]' key={index}>                      
                                                
                                                <div className='w-[100%] h-[100%] flex'>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center p-2'>
                                                        <div className='w-[100%] h-[100%] border rounded-lg bg-white flex items-end justify-center'>
                                                            <img className='w-[80%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                         </div>
                                                    </div>
                                                    <div className='w-[35%] h-[100%] pl-3 flex items-center'>
                                                         <h1 className='text-xl font-thin'>{appt.FName} {appt.LName}</h1>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                        <h2></h2>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                         <h1 className='text-blue-400 font-semibold'>{appt.Status}</h1>
                                                    </div>
                                                    
                                                    <div className='w-[20%] h-[100%] flex items-center justify-center'>
                                                        <button className=' font-bold hover:text-violet-400' ref={buttonRef} onClick={() => fetchPendingServices(appt.CustomerID)}>
                                                                View
                                                        </button>
                                                   </div>

                                                </div>
                                            </div>
                                                {isPopupOpen && selectedCustomerID === appt.CustomerID && (
                                                          <div className='w-[100%] h-[100%] fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-80'>
                                                                <div className='w-[40%] h-[50%] bg-gray-100 rounded-lg flex flex-col p-3 border'>
                                                                   
                                                                    <div className='w-[100%] h-[20%] flex justify-between  mb-2'>
                                                                       
                                                                        <div className='w-[70%] h-[100%] bg-white p-2 flex rounded-lg border'>
                                                                            <div className='w-[18%] h-[100%] bg-gray-100 flex items-end justify-center border rounded-lg'>
                                                                                 <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                                            </div>
                                                                            <div className='w-[50%] h-[100%] flex flex-col justify-center items-center'>
                                                                                <div className='w-[100%] h-[40%] pl-3 flex items-center'> 
                                                                                    <h1 className='text-3xl text-violet-500'>{appt.FName} {appt.LName}</h1>
                                                                                </div>
                                                                                <div className='w-[100%] h-[35%] pl-3 flex items-center'> 
                                                                                    <h1 className=''>Customer ID: {selectedCustomerID}</h1>
                                                                                </div>
                                                                            </div>
                                                                            <div className='w-[32%] h-[100%] flex items-center justify-center'>
                                                                                    <h1 className='font-semibold text-blue-400'>{appt.Status}</h1>                                                                     
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        
                                                                        <div className='w-[29%] h-[100%] p-3 bg-white border rounded-lg border-violet-300'>

                                                                            <div className='w-[100%] h-[100%] flex items-center justify-center pl-1 pr-1'>
                                                                                <select onChange={(e) => setSelectedEmployee(e.target.value)} className='w-[100%] h-[100%] focus:outline-none text-lg'>

                                                                                    <option value="">Select an employee</option>
                                                                                    {employee.map((employee) => (
                                                                                        <option key={employee.EmployeeID} value={employee.EmpFName}>
                                                                                            {employee.EmpFName} {employee.EmpLName} {/* Display full name for the dropdown */}
                                                                                        </option>
                                                                                    ))}    
                                                                                </select>                                                                   
                                                                            </div>
                                                                           
                                                                        </div>
                                                                       
                                                                    </div>
                                                                    
                                                                    
                                                                    <div className='w-[100%] h-[80%]'>
                                                                        <div className='w-[100%] h-[15%] flex items-center justify-between rounded-lg'>
                                                                            <div className='w-[70%] h-[100%] flex bg-white rounded-lg border items-center pl-3 pr-3 justify-between'>
                                                                                <h1 className='text-xl font-semibold'>Services</h1> <h1 className=' font-thin'>Due Amount: <span className='text-blue-400'>{totalAmount}</span></h1>
                                                                            </div>
                                                                            <div className='w-[29%] h-[100%] rounded-lg bg-white border flex items-center justify-center border-violet-300'>
                                                                                <div className='w-[100%] h-[100%] flex items-center justify-center rounded-lg hover:bg-violet-200 hover:text-white cursor-pointer'>
                                                                                    <button onClick={updateAppointment} className='font-semibold w-[100%] h-[100%]'>Assign</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[100%] h-[85%] overflow-y-scroll'>
                                                                            {services.map((service, index) => (
                                                                                
                                                                                    <div className='bg-white rounded-lg mb-2 h-[30%] p-3 mt-2 flex border' key={index}>
                                                                                       <div className='w-[40%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold'>Service Name</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-2xl font-light'> {service.serviceName}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[15%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold'>Price</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-2xl font-light'>{service.Price}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[25%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold'>Date</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-2xl font-light'>{service.Date}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[20%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold'>Time</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-2xl font-light'>{service.Time}</h1>
                                                                                            </div>
                                                                                       </div>               
                                                                                    </div>
                                                                               
                                                                            ))}
                                                                         </div>
                                                                    </div>
                                                                       
                                                                </div> 
                                                                    <div className='w-[1%] h-[42%]'> 
                                                                        <div className='w-[100%] h-[18%] bg-pink-300'></div>
                                                                        <div className='w-[100%] h-[18%] bg-violet-300'></div>          
                                                                        <div className='w-[100%] h-[18%] bg-violet-400'></div>     
                                                                        <div className='w-[100%] h-[18%] bg-violet-500'></div>                                                   
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => setIsPopupOpen(false)} 
                                                                        className="mt-2  bg-black bg-opacity-20 hover:bg-black text-white px-4 py-2 rounded-full ml-3 font-semibold"
                                                                    >
                                                                        x
                                                                    </button>   
                                                            </div>
                                                            
                                                    )}
       
                                                </div>                   
                                            ))}           
                                        </div>
                                    ) : (
                                        <div className='w-[100%] h-[100%] flex items-center justify-center'> 
                                            <h1 className='text-gray-500'>No appointments found.</h1>
                                        </div>                              
                                    )}  
                                
                                    
                            </div>
                            
                             <div className='w-[49.5%] h-[100%] bg-white rounded-lg p-3 flex '>
                             {paidAppointments.length > 0 ? (
                                    <div className='flex-col h-[100%] w-[100%] overflow-y-scroll'>
                                       {paidAppointments.filter((appt) => appt.Status === 'Paid') // Filter appointments with "Paid" status
                                        .map((appt, index) => (
                                        <div className='w-[100%] h-[20%] mb-2 bg-gray-100 rounded-lg border'>
                                           <div className='w-[100%] h-[100%]' key={index}>                      
                                                
                                            <div className='w-[100%] h-[100%] flex'>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center p-2'>
                                                        <div className='w-[100%] h-[100%] border rounded-lg bg-white flex items-end justify-center'>
                                                            <img className='w-[80%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                         </div>
                                                    </div>
                                                    <div className='w-[35%] h-[100%] pl-3 flex items-center'>
                                                         <h1 className='text-xl font-thin'>{appt.FName} {appt.LName}</h1>   
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                         <h1 className='text-green-400 font-semibold'>{appt.Status}</h1>
                                                    </div>
                                                    
                                                    <div className='w-[20%] h-[100%] flex items-center justify-center'>
                                                        <button className=' font-bold hover:text-violet-400' ref={buttonRef} onClick={() => fetchPaidServices(appt.CustomerID)}>
                                                                View
                                                        </button>
                                                   </div>

                                                </div>
                                            </div>
                                                {isPopupOpen2 && selectedCustomerID === appt.CustomerID && (
                                                    <div className='w-[100%] h-[100%] fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-40'>
                                                        <div className='w-[40%] h-[50%] bg-gray-100 rounded-lg flex flex-col p-3 border'>
                                                            
                                                            <div className='w-[100%] h-[20%] flex justify-between  mb-2'>
                                                                
                                                                <div className='w-[70%] h-[100%] bg-white p-2 flex rounded-lg border '>
                                                                    <div className='w-[18%] h-[100%] flex items-end justify-center bg-gray-100 border rounded-lg'>
                                                                            <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                                    </div>
                                                                    <div className='w-[50%] h-[100%] flex flex-col justify-center items-center '>
                                                                        <div className='w-[100%] h-[40%] pl-3 flex items-center'> 
                                                                            <h1 className='text-3xl'>{appt.FName} {appt.LName}</h1>
                                                                        </div>
                                                                        <div className='w-[100%] h-[35%] pl-3 flex items-center'> 
                                                                            <h1 className=''>Customer ID: {selectedCustomerID}</h1>
                                                                        </div>
                                                                    </div>
                                                                    <div className='w-[32%] h-[100%] flex items-center justify-center'>
                                                                            <h1 className='font-semibold text-green-400'>{appt.Status}</h1>
                                                                    </div>
                                                                    
                                                                </div>
                                                                
                                                                <div className='w-[29%] h-[100%] bg-white border border-violet-300 rounded-lg flex items-center justify-center'>
                                                                    <h1 className='text-lg font-semibold text-violet-400'>{appt.EmpFName} {appt.EmpLName}</h1>
                                                                </div>
                                                                
                                                            </div>
                                                            
                                                            <div className='w-[100%] h-[80%]'>
                                                                <div className='w-[100%] h-[15%] flex items-center justify-between rounded-lg'>
                                                                    <div className='w-[70%] h-[100%] flex bg-white rounded-lg border items-center pl-3 justify-between pr-3'>
                                                                        <h1 className='text-xl font-semibold'>Services</h1> <h1 className=' font-thin'>Due Amount: <span className='text-green-400'>0</span></h1>
                                                                    </div>
                                                                    <div className='w-[29%] h-[100%] rounded-lg bg-white border-violet-300 border flex items-center justify-center'>
                                                                       <h1 className='text-semibold'>Assigned</h1>
                                                                    </div>
                                                                </div>
                                                                <div className='w-[100%] h-[85%] overflow-y-scroll'>
                                                                    {services.map((service, index) => (
                                                                        
                                                                    <div className='bg-white rounded-lg mb-2 h-[30%] p-3 mt-2 flex border' key={index}>
                                                                        <div className='w-[40%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold'>Service Name</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-2xl font-light'> {service.serviceName}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[40%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold'>Date</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-2xl font-light'>{service.Date}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[20%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold'>Time</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-2xl font-light'>{service.Time}</h1>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                        
                                                                    ))}
                                                                    </div>
                                                            </div>
                                                                
                                                        </div> 
                                                        <div className='w-[1%] h-[42%]'> 
                                                                        <div className='w-[100%] h-[18%] bg-pink-300'></div>
                                                                        <div className='w-[100%] h-[18%] bg-violet-300'></div>          
                                                                        <div className='w-[100%] h-[18%] bg-violet-400'></div>     
                                                                        <div className='w-[100%] h-[18%] bg-violet-500'></div>                                                   
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => setIsPopupOpen2(false)} 
                                                                        className="mt-2 bg-black bg-opacity-20 hover:bg-black text-white px-4 py-2 rounded-full ml-3 font-semibold"
                                                                    >
                                                                        x
                                                                    </button>   
                                                    </div>
                                                )}  
                                                
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='w-[100%] h-[100%] flex items-center justify-center'> 
                                            <h1 className='text-gray-500'>No appointments found.</h1>
                                        </div>          
                                    )}  

                            </div>
                        </div>

                    </div>

                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <div className='w-[100%] h-[100%] bg-green-500 flex items-center justify-center'>
                        <h1>Client Content</h1>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default AdminInterface;
