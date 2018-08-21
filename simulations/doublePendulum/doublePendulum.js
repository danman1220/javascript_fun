//y = [a1,a2,a1_v,a2_v]

function diffeq(t,y) {

	//update angle with diffy q
	var num1 = -g*(2*m1+m2)*Math.sin(y[0]);
	var num2 = -m2*g*Math.sin(y[0]-2*y[1]);
	var num3 = -2*Math.sin(y[0]-y[1])*m2*(y[3]*y[3]*l2 + y[2]*y[2]*l1*Math.cos(y[0]-y[1]));
	var den = l1*(2*m1 + m2 - m2*Math.cos(2*y[0] - 2*y[1]))

	a1_a = (num1 + num2 + num3)/den;

	num1 = 2*Math.sin(y[0]-y[1]);
	num2 = y[2]*y[2]*l1*(m1+m2);
	num3 = g*(m1+m2)*Math.cos(y[0]);
	var num4 = y[3]*y[3]*l2*m2*Math.cos(y[0]-y[1]);
	den = l2*(2*m1 + m2 - m2*Math.cos(2*y[0]-2*y[1]))

	a2_a = (num1*(num2 + num3 + num4))/den

	return [y[2],y[3],a1_a,a2_a];
}